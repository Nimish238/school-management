const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstname:{
    type:String,
    required:true,
  },
  lastname:{
    type:String,

  },
email:{
  type:String,
  unique:true,
    required:true,
},
phone:{
  type:Number,
  unique:true,
    required:true,
},
gender:{
  type:String,
},
age:{
  type:Number,
  required:true,
},
dob:{
  type:String,
  required:true,
},
// std:{
//    type:String,
// },
// div:{
//    type:String,
// },
rollno:{
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
},

})


const Userlogin = new mongoose.model("Userlogin",employeeSchema);
module.exports= Userlogin ;
