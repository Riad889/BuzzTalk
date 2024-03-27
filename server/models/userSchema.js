const mongoose = require("mongoose");
const bcrypt=require('bcryptjs');

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default:"Guest"
  },
  email: {
    type: String,
    required: true,
    default:'Guest',
  },
  password: {
    type: String,
    required: true,
    default:'Guest'
  },
  pic: {
    type: String,
    required: true,
    default:
      "https://th.bing.com/th/id/R.d2c893f55930c7cb5bfe41538be295d7?rik=RCCbETsRGcm2iQ&pid=ImgRaw&r=0",
  },
},{
    timestamps:true
});

const User=mongoose.model("User",userModel);
module.exports=User;


