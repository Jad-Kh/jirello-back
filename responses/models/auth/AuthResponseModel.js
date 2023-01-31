class AuthResponseModel {
  token = undefined;
  id = undefined;

  constructor(values) {
    this.token = values.token;
    this.id = values.id;
  }

  setToken(token) {
    this.token = token;
  }
}

export {
  AuthResponseModel
};