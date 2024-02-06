class AuthResponseModel {
  refreshToken = undefined;
  accessToken = undefined;
  id = undefined;

  constructor(values) {
    this.refreshToken = values.refreshToken;
    this.accessToken = values.accessToken;
    this.id = values.id;
  }
}

export {
  AuthResponseModel
};