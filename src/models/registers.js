const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  firstname:{
    type:String,
required:true,
  },
  lastname:{
    type:String,
required:true,
  },
email:{
  type:String,
  unique:true,
    required:true,
},
phone:{
  type:Number,
  unique:true,
},
gender:{
  type:String,
},
age:{
  type:Number,
},
dob:{
  type:String,
    required:true,
},
qlf:{
  type:String,
},
password:{
  type:String,
  required:true,
},
confirmpassword:{
  type:String,
    required:true,
},
image:{
  type:String,
    required:true,
}
})

const Register = new mongoose.model("Register",employeeSchema);
module.exports= Register;
