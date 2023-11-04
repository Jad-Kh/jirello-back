class RecoveryRequestModel {
    email = undefined;

    constructor(values) {
      this.email = values?.email;
    }
}
  
export {
    RecoveryRequestModel
}