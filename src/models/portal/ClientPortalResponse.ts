import type { IClientPortal } from "../../database/models/portal/IClientPortal.js";
import { APISignature } from "../api/APISignature.js";

export class ClientPortalResponse extends APISignature {
    communityId: string;
    projectId: string;
    enabled: boolean;
    name?: string;
    welcomeMessage?: string;
    logoUrl?: string;
    accentColor?: string;
    showProgress: boolean;
    showMilestones: boolean;
    showFinancials: boolean;
    publicEnabled: boolean;
    publicSlug?: string;

    constructor(values: IClientPortal) {
        super(values);
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.enabled = values.enabled;
        this.name = values.name;
        this.welcomeMessage = values.welcomeMessage;
        this.logoUrl = values.logoUrl;
        this.accentColor = values.accentColor;
        this.showProgress = values.showProgress;
        this.showMilestones = values.showMilestones;
        this.showFinancials = values.showFinancials;
        this.publicEnabled = values.publicEnabled;
        this.publicSlug = values.publicSlug;
    }
}
