const mongoose = require ("mongoose");
const employeeSchema = new mongoose.Schema({

	Name:{
		type:String,
		required:true
	},
	Identity:{
		type:String,
		required:true
	},
	Physics:{
		type:Number,
		required:true
	},
	Chemistry:{
		type:Number,
		required:true
	},
	Mathematics:{
		type:Number,
		required:true
	},
	Tilldate:{
		type:String,
		required:true
	}

});

const Attendance = new mongoose.model("Attendance",employeeSchema);
module.exports= Attendance;
