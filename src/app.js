//import express
const express= require('express');

// const https = require("https");
// const qs = require("querystring");

const excelToJson = require('convert-excel-to-json');


//import path
const path=require("path");

//import multer
const multer=require('multer')

const fs=require('fs')

//create express app
const app=express();

//import pdf for tc generation
const pdf = require('pdfkit');
const myDoc=new pdf();

//import view engine
const hbs=require("hbs");

//import models
const Register = require("./models/registers");
const Userlogin = require("./models/Userlogin");
const Result = require("./models/Result");
const Attendance = require("./models/Attendance");
const Message = require("./models/Message");

const port=process.env.PORT ||3000 //it will help to open this site on any port or our port

//import our css and upload file
const static_path=path.join(__dirname,"../public");

//import our hbs files
const template_path=path.join(__dirname,"../templates/views");

//import our uploads
const upload_path=path.join(__dirname,"../uploads");

app.use(express.json());
//middleware
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
//register view engine
app.set("view engine","hbs");
app.set("views",template_path);
//hbs.registerPartials(partials_path);

//connection between node and mongo atlas
const mongoose= require('mongoose');
const DB = 'mongodb+srv://nimish:nimishdevpura@cluster0.sgpbj.mongodb.net/registration?retryWrites=true&w=majority';
mongoose.connect(DB,{
  useNewUrlParser:true,
  useFindAndModify: false,
  useUnifiedTopology:true,
  useCreateIndex:true
}).then(()=>{
  console.log(`connection successful`);
}).catch((err)=>  console.log(`no connection`));

//join upload path
app.use(express.static(upload_path));


//middleware to identify static files
// app.use(express.static("./uploads/"));


//define storage for images
const storage=multer.diskStorage({
    //destination for files
    destination:function (req, file, cb) {
        cb(null, "uploads");
      },
    //add back the extension
    filename:function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname))
    }
});


//upload parameters for multer
const upload=multer({
    storage:storage,
}).single('image')


//configure requests
app.get("/",(req,res)=>{
  res.render("index");
});


app.get("/register",(req,res)=>{
  res.render("register");
});

app.get("/stdregister",(req,res)=>{
  res.render("stdregister");
})

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get("/stdlogin",(req,res)=>{
  res.render("stdlogin");
})

app.get("/teacherstudent",(req,res)=>{
  res.render("teacherstudent");
})

//message admin
app.get("/message/:id",async(req,res)=>{
  try{
    const id=req.params.id;
    details= await Userlogin.findById({_id:id});
    res.render("messageadmin",{users:details});
}
catch(error){
  res.status(404).send(error);
}
})

app.post("/message/:id",async(req,res)=>{
  try{
    const messageadmin = new Message({
   name:req.body.name,
   date:req.body.date,
   message:req.body.message,
 })

 const userregistered = await messageadmin.save();
 res.render("stdlogin",{users:userregistered});
}
catch(error){
res.status(404).send(error);
}
});

app.get("/showmwssage",async(req,res)=>{
  try{
  details = await Message.find();
res.render("showmwssage",{users:details});
}
catch(error){
  res.status(404).send("error");
}
})


//admin login details
app.get("/adminlogin",(req,res)=>{
  res.render("adminlogin");
})

app.post("/admin",(req,res)=>{
  try{
    const email=req.body.email;
    const password=req.body.password;
    const e="admin@gmail.com";
    const p="1234";
   if(email==e&&password==p){
  res.render("admin");
  }
   else{
   res.send("details not matched");
   }
   }
catch(error){
  res.status(401).send("error");
   }
   })

// massupload
   app.get("/massupload",(req,res)=>{
     res.render("massupload");
   })

   app.post("/pssd",async(req,res)=>{
	try{
	if(req.body.pswd=='1234'){
		let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb+srv://nimish:nimishdevpura@cluster0.sgpbj.mongodb.net/registration?retryWrites=true&w=majority';

// -> Read Excel File to Json Data
const excelData = excelToJson({
    sourceFile: 'customers.xlsx',
    sheets:[{
		// Excel Sheet Name
        name: 'Customers',

		// Header Row -> be skipped and will not be present at our result object.
		header:{
            rows: 1
        },

		// Mapping columns to keys
        columnToKey: {
      A:'firstname',
 			B: 'lastname',
			C: 'email',
			D: 'phone',
			E: 'gender',
			F: 'age',
			G: 'dob',
			H: 'rollno',
      I:'password',
      J:'confirmpassword',

        }
    }]
});
// -> Log Excel Data to Console
console.log(excelData);
// -> Insert Json-Object to MongoDB
MongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true  }, (err, db) => {
  if (err) throw err;

  var dbo = db.db("registration");

  dbo.collection("userlogins").insertMany(excelData.Customers, (err, res) => {
	if (err) throw err;

	console.log("Number of documents inserted: " + res.insertedCount);
	db.close();
  });
});

	res.redirect("/allstds");
	}
	else{
		res.render('massupload',{
			err:'Wrong Password'
		});
	}
}catch(error){
      res.status(404).send("error");
  }
});

//student initiation
app.post("/studentregister",upload,async(req,res)=>{
try{
   const password = req.body.password;
   const cpassword = req.body.confirmpassword;

   if(password===cpassword){

   const registerEmployee = new Userlogin({
    firstname:req.body.firstname,
    lastname:req.body.lastname,
     email:req.body.email,
     phone:req.body.phone,
     gender:req.body.gender,
     age:req.body.age,
     dob:req.body.dob,
    rollno:req.body.rollno,
     password:password,
     confirmpassword:cpassword,
     image:req.file.filename
   })

    const userregistered = await registerEmployee.save();
    res.status(201).render("stdlogin",{users:userregistered});
   }else{
     res.send("password are not matching");
   }
}catch(error){
  res.status(404).send(error);
}
});


//teacher initiation
app.post("/register",upload,async(req,res)=>{
try{
   const password = req.body.password;
   const cpassword = req.body.confirmpassword;

   if(password===cpassword){

   const registerEmployee = new Register({
    firstname:req.body.firstname,
    lastname:req.body.lastname,
     email:req.body.email,
     phone:req.body.phone,
     gender:req.body.gender,
     age:req.body.age,
     dob:req.body.dob,
     password:password,
     confirmpassword:cpassword,
     image:req.file.filename
   })
    const registered = await registerEmployee.save();
    res.status(201).render("login",{user:registered});
   }else{
     res.send("password are not matching");
   }
}catch(error){
  res.status(404).send(error);
}
});


//teacher login
app.post("/login",async(req,res)=>{
try{
const email = req.body.email;
const password = req.body.password;

  const useremail= await Register.findOne({email:email});
  if(useremail.password===password){
    res.status(201).render("teacherprofile",{user:useremail});
  }
  else{
    res.status(404).render("signin",{
      error:"invalid login details"
    });
  }
}
catch(error){
  res.status(404).render("login",{
    error:"invalid login credentials"
  })
};
});

//student login
app.post("/studentlogin",async(req,res)=>{
try{
const email = req.body.email;
const password = req.body.password;

  const useremail= await Userlogin.findOne({email:email});
  if(useremail.password===password){
    res.status(201).render("studentprofile",{users:useremail});
  }
  else{
    res.status(404).render("signin",{
      error:"invalid login details"
    });
  }
}
catch(error){
  res.status(404).render("stdlogin",{
    error:"invalid login credentials"
  });
};
});

//generate tc of a students

app.get('/downloadTC/:id',async(req,res)=>{
	 try{
	 const id=req.params.id;
    const result= await Userlogin.findOne({_id:id});
    const firstname=result.firstname;
	 const lastname=result.lastname;
	 const name = firstname+" "+lastname;
       // console.log(name);
            myDoc.pipe(fs.createWriteStream( "name" + '.pdf'));

	        myDoc.font('Times-Roman');
	        myDoc.fontSize(30);
	        myDoc.text('Dear ' + name + ',' , 50 , 50 );
	        myDoc.fontSize(20);
	        myDoc.text(' ');
	        myDoc.text('We are granting you leaving certificate' );
	        myDoc.fontSize(15);
	        myDoc.fillColor('red');
	        myDoc.text('The conduct of yours has been good');
	        myDoc.text(' ');
	        myDoc.fillColor('green');
	        myDoc.text('we wish you all the best for your future studies.');
            myDoc.end();


            setTimeout(function(){const data=fs.readFileSync('./'+"name"+'.pdf',{root:__dirname})
            res.contentType('application/pdf')
            res.send(data)
          },3000)
    }catch(error){
      res.status(404).send("error");
  }


});

//display all students data
app.get("/display",async(req,res)=>{
  try{
   const displaydetails= await Userlogin.find();
  res.render("display",{users:displaydetails});

}
    catch(error){
      res.status(404).send("error");
    }
});

app.get("/allstds",async(req,res)=>{
  try{
   const displaydetails= await Userlogin.find();
  res.render("allstds",{users:displaydetails});

}
    catch(error){
      res.status(404).send("error");
    }
});

//display all teachers data
app.get("/teacherdisplay",async(req,res)=>{
  try{
   const displaydetails= await Register.find();
  res.render("teacherdisplay",{users:displaydetails});

}
    catch(error){
      res.status(404).send("error");
    }
});

//display all details of student
app.get("/display/:id",async(req,res)=>{
  try{
   const id = req.params.id,
     details = await Userlogin.find({_id:id});
  res.render("details",{user:details});
 }
 catch(error){
   res.status(404).send("error");
 }
});


//display all details of student
app.get("/update/:id",async(req,res)=>{
  try{
   const id = req.params.id,
     details = await Register.find({_id:id});
  res.render("teacherupdate",{user:details});
 }
 catch(error){
   res.status(404).send("error");
 }
});

//delete student profile
app.get("/delete/:id",function(req,res,next){

    const id= req.params.id,
       del= Userlogin.findByIdAndDelete(id);
      del.exec(function(err){
        if(err) throw err;
        res.redirect("/display");
      });
});

//delete student in admin section
app.get("/delete1/:id",function(req,res,next){

    const id= req.params.id,
       del= Userlogin.findByIdAndDelete(id);
      del.exec(function(err){
        if(err) throw err;
        res.redirect("/allstds");
      });
});

//delete message
app.get("/messagedelete/:id",function(req,res,next){
    const id= req.params.id,
       del= Message.findByIdAndDelete(id);
      del.exec(function(err){
        if(err) throw err;
        res.redirect("/showmwssage");
      });
});



//delete teacher profile
app.get("/teacherdelete/:id",function(req,res,next){

    const id= req.params.id,
       del= Register.findByIdAndDelete(id);
      del.exec(function(err){
        if(err) throw err;
        res.redirect("/teacherdisplay");
      });
});


//update student profile
app.post("/update/:id",async(req,res)=>{
  try{
    const id=req.params.id;
    const update=await Userlogin.findByIdAndUpdate(id,{
      firstname:req.body.firstname,
      lastname:req.body.lastname,
       email:req.body.email,
       phone:req.body.phone,
       age:req.body.age,
       dob:req.body.dob,
       rollno:req.body.rollno,
    });
    res.redirect("/display");
  }
  catch(error){
    res.status(404).send("error");
  }
})

app.get("/display1/:id",async(req,res)=>{
  try{
   const id = req.params.id,
     details = await Userlogin.find({_id:id});
  res.render("details1",{user:details});
 }
 catch(error){
   res.status(404).send("error");
 }
});

// update student profile
app.post("/update1/:id",async(req,res)=>{
  try{
    const id=req.params.id;
    const update=await Userlogin.findByIdAndUpdate(id,{
      firstname:req.body.firstname,
      lastname:req.body.lastname,
       email:req.body.email,
       phone:req.body.phone,
       age:req.body.age,
       dob:req.body.dob,
       rollno:req.body.rollno,
    });
    res.redirect("/allstds");
  }
  catch(error){
    res.status(404).send("error");
  }
})


//update teacher profile
app.post("/teacherupdate/:id",async(req,res)=>{
  try{
    const id=req.params.id;
    const update=await Register.findByIdAndUpdate(id,{
      firstname:req.body.firstname,
      lastname:req.body.lastname,
       email:req.body.email,
       phone:req.body.phone,
       age:req.body.age,


    });
    res.redirect("/teacherdisplay");
  }
  catch(error){
    res.status(404).send("error");
  }
})

//add marks
app.get("/result/:id",async(req,res)=>{
try{
  const id = req.params.id;
  const result=await Userlogin.find({_id:id});
  res.render("result",{users:result});
}
catch(error){
  res.status(404).send("error");
}
});

//post result in mongodb
app.post("/result/:id",async(req,res)=>{
  try{
    const id= req.params.id;
    const del = await Result.findOneAndDelete({identity:id});

    const result = new Result({
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      identity:req.body.id,
      physics:req.body.physics,
      chemistry:req.body.chemistry,
      maths:req.body.maths,
      percentage:req.body.percentage,
    });
    const marks= await result.save();
    res.status(201).redirect("/display");
  }
  catch(error){
    res.status(404).send("error");
  }
});

//see result
app.get("/results/:id",async(req,res)=>{
try{
  const id = req.params.id;
  const result=await Result.find({identity:id});
  res.render("studentsresult",{users:result});
}
catch(error){
  res.status(404).send("error");
}
});


app.get("/attendance",async(req,res)=>{
		try{
		const display= await Userlogin.find();
    const attddisplay = await Attendance.find();
		res.render("attendance",{
			stds:display,atds:attddisplay
		});
		}catch(error){
      res.status(404).send("error");
  }
});


app.post("/attendance/:id",async(req,res)=>{
try{
	const id=req.params.id;
	const del = await Attendance.findOneAndDelete({Identity:id});
	const upd= new Attendance({
    		Name:req.body.name,
			Identity:req.body.id,
			Physics:req.body.ph,
			Chemistry:req.body.ch,
			Mathematics:req.body.mt,
			Tilldate:req.body.dates
})
	const enter=await upd.save();
	res.redirect("/attendance");
    }catch(error){
      res.status(404).send("error");
    }
});

app.get("/showattendance/:id",async(req,res)=>{
		try{
			const id=req.params.id;
			const show= await Attendance.find({Identity:id});

		res.render("showattendance",{
			users:show
		});
		}catch(error){
      res.status(404).send("error");
  }
});

app.listen(port,()=>{
  console.log(`server is running at port no ${port}`);
});
