class UserProfileRequestModel {
    username = undefined;
    firstName = undefined;
    lastName = undefined;
    birthday = undefined;
    email = undefined;
    password = undefined;

    constructor(values) {
      this.username = values.username;
      this.firstName = values.firstName;
      this.lastName = values.lastName;
      this.birthday = values.birthday;
      this.email = values.email.toLowerCase();
      this.password = values.password;
    }
}

export {
  UserProfileRequestModel
}