class LogInRequestModel {
    username = undefined;
    email = undefined;
    password = undefined;

    constructor(values) {
      this.username = values?.username;
      this.email = values?.email;
      this.password = values.password;
    }
}
  
export {
    LogInRequestModel
}