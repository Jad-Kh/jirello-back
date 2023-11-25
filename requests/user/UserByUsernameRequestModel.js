class UserByUsernameRequestModel {
    username = undefined;

    constructor(values) {
      this.username = values.email;
    }
}
  
export {
    UserByUsernameRequestModel
}