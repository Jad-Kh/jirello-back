class SignUpRequestModel {
    userName = undefined;
    email = undefined;
    firstName = undefined;
    lastName = undefined;
    password = undefined;
    birthday = undefined;

    constructor(values) {
      this.userName = values.userName;
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