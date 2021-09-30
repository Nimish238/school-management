const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },

date:{
  type:String,
},
message:{
   type:String,
   required:true
},

})


const Message = new mongoose.model("Message",employeeSchema);
module.exports= Message ;
