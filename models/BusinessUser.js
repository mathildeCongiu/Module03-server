const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const businessUserSchema = new Schema(
  {
    relationship: { type: String, default: "business" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    // logo: String,
    // address: {
    //   street: { type: String, required: true },
    //   number: { type: Number, required: true },
    //   flat: { type: String },
    //   city: { type: String, required: true },
    //   postcode: { type: Number, required: true },
    //   country: { type: String, required: true },
    // },
    // phoneNumber: { type: Number },
    // description: String,
    // partnerships: [{ type: Schema.Types.ObjectId, ref: "AssoUser" }],
    // pendingPartnerships: [{ type: Schema.Types.ObjectId, ref: "AssoUser" }],
    // products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    type: {
      name: { type: String},
      // img: { type: String },
    },
    // pickup: {
    //   date: { type: Date },
    //   place: { type: String },
    // },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const BusinessUser = mongoose.model("BusinessUser", businessUserSchema);

module.exports = BusinessUser;
