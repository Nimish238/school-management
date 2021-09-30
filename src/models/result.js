const mongoose = require ("mongoose");
const employeeSchema = new mongoose.Schema({
  identity:{
    type:String,
  },
physics:{
  type:Number,
  required:true,
},
chemistry:{
  type:Number,
    required:true,
},
maths:{
  type:Number,
  required:true,
},
percentage:{
  type:Number,

},
})

const Result = new mongoose.model("Result",employeeSchema);
module.exports= Result;
