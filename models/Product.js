const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({

  name: {type: String, required: true},
  owner: { type: Schema.Types.ObjectId, ref: "BusinessUser" },
  productType: {
    name: {type: String, required : true},
    img: String
  },
  today: {
    isAvailable:  Boolean,
    quantity: String
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;