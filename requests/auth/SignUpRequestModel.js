class SignUpRequestModel {
    username = undefined;
    email = undefined;
    firstName = undefined;
    lastName = undefined;
    password = undefined;
    birthday = undefined;

    constructor(values) {
      this.username = values.username;
      this.email = values.email;
      this.firstName = values.firstName;
      this.lastName = values.lastName;
      this.password = values.password;
      this.birthday = values?.birthday;
    }
}
  
export {
    SignUpRequestModel
}