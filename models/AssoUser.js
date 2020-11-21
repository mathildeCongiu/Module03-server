const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssoUserSchema = new Schema(
  {
    relationship: { type: String, default: "association" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    logo: String,
    address: {
      street: { type: String, required: true },
      number: { type: Number, required: true },
      flat: { type: String },
      city: { type: String, required: true },
      postcode: { type: Number, required: true },
      country: { type: String, required: true },
    },
    phoneNumber: { type: Number },
    description: String,
    partnerships: [{ type: Schema.Types.ObjectId, ref: "BusinessUser" }],
    pendingPartnerships: [{ type: Schema.Types.ObjectId, ref: "BusinessUser" }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const AssoUser = mongoose.model("AssoUser", AssoUserSchema);

module.exports = AssoUser;
