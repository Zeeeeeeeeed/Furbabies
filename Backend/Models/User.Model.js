const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    Username: {
      type: String,
    },
    Firstname: {
        type: String,
    },
    Lastname: {
        type: String,
    },
    Email: {
      type: String,
    },
    Password: {
      type: String,
    },
  });
  const Contract = mongoose.model("User", UserSchema);
  module.exports = Contract;