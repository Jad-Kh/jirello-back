# NGINX Gateway Fabric deployment

## Traffic boundary

Production traffic follows this path:

```text
Internet and DNS
    -> cloud LoadBalancer Service managed by NGINX Gateway Fabric
    -> NGINX data-plane pods
    -> Gateway and HTTPRoute
    -> jirello-api ClusterIP Service
    -> ready API pods
```

Only NGINX is public. The API Service is deliberately `ClusterIP`, and the API
NetworkPolicy accepts application traffic only from the NGINX data-plane pods
created for `jirello-gateway`. Monitoring can still scrape operational endpoints.
The NGINX control plane runs in `nginx-gateway`; NGINX Gateway Fabric creates the
data plane in the same `jirello` namespace as the Gateway.

The repository uses Gateway API rather than the retired community ingress-nginx
controller. NGINX Gateway Fabric provides the maintained NGINX data plane and its
Gateway API implementation.

## One-time cluster installation

Install the Gateway API CRDs and NGINX Gateway Fabric before applying this
application. These commands pin the currently tested controller release; review
the upstream upgrade notes before changing it.

```powershell
kubectl kustomize "https://github.com/nginx/nginx-gateway-fabric/config/crd/gateway-api/standard?ref=v2.6.7" | kubectl apply -f -
kubectl apply -f https://raw.githubusercontent.com/nginx/nginx-gateway-fabric/v2.6.7/deploy/default/deploy.yaml
kubectl -n nginx-gateway rollout status deployment/nginx-gateway
kubectl get gatewayclass nginx
```

The NGINX installation includes the `gateway.nginx.org` policy CRDs used by
`k8s/nginx-policies.yaml`. If platform engineering installs the controller with
Helm instead, keep the GatewayClass name as `nginx` or update
`k8s/gateway.yaml` to match the installed class.

## Per-environment configuration

Before deployment:

1. Replace `api.jirello.example.com` in `k8s/gateway.yaml` with the API hostname.
2. Replace the frontend hostname in `k8s/configmap.yaml` so `CORS_ORIGIN` exactly
   matches the deployed UI origin.
3. Copy `jirello-ui/.env.production.example` to `.env.production`, set the same
   API hostname, and build the frontend. Vite embeds this value at build time.
4. Create the TLS Secret in the `jirello` namespace without committing its key:

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl -n jirello create secret tls jirello-api-tls --cert=path/to/fullchain.pem --key=path/to/private-key.pem
```

Use your certificate manager instead when available, but retain the Secret name
`jirello-api-tls` or update the Gateway reference. Create an A/AAAA or CNAME DNS
record for the API hostname after the Gateway receives its external address.

`TRUST_PROXY_HOPS=1` is set for the API because NGINX is the one trusted reverse
proxy between the external client and Express. Change it only when the real proxy
path changes. An incorrect value can make client-IP-based security trust a spoofed
forwarding header.

## Apply and verify

Render first so missing CRDs, invalid references, and environment substitutions are
found before rollout:

```powershell
kubectl kustomize k8s
kubectl apply -k k8s
kubectl -n jirello wait --for=condition=Programmed gateway/jirello-gateway --timeout=5m
kubectl -n jirello get gateway jirello-gateway
kubectl -n jirello get httproute
kubectl -n jirello rollout status deployment/jirello-api
```

Confirm the HTTP redirect, TLS route, request ID, and readiness through the public
hostname:

```powershell
curl.exe -I http://api.jirello.example.com/health/live
curl.exe -i https://api.jirello.example.com/health/ready
```

The first response should redirect to HTTPS. The second should return `200`, a
structured readiness body, and an `x-request-id` header. A request body larger than
1 MB is rejected by NGINX before reaching Express. NGINX uses a 5-second upstream
connect timeout, a 35-second read timeout, and a 30-second send timeout.

## Local development

Kubernetes is not required locally. `docker compose up --build` continues to use
`deploy/nginx.conf`, and `docker compose up --scale api=3` lets the local NGINX
container balance multiple API instances on `http://localhost:8082`.
