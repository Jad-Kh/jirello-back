import { APISignatureResponseModel } from "../../API/APISignatureResponseModel.js";

class UserProfileResponseModel extends APISignatureResponseModel {
    username = undefined;
    firstName = undefined;
    lastName = undefined;
    birthday = undefined;
    email = undefined;

    constructor(values) {
      super(values);
      this.username = values.username;
      this.firstName = values.firstName;
      this.lastName = values.lastName;
      this.birthday = values?.birthday;
      this.email = values.email;
    }
}

export {
  UserProfileResponseModel
}