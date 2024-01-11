const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors(
  //{
  //origin: process.env.URL_FRONTEND || 'http://localhost:3000',
  //methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//}
));
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;

//mongodb connection
console.log(process.env.MONGODB_URL)
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type : String,
    unique : true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});


const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running quocanh");
});

//sign up
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  try {
    const result = await userModel.findOne({ email: email }).exec();
    console.log(result);
    if (result) {
      res.send({ message: "Email id is already registered", alert: false });
    } else {
      const data = userModel(req.body);
      const save = await data.save();
      res.send({ message: "Successfully signed up", alert: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});
  //const select  = { email: 1, password: 2 }
 //const result = await userModel.findOne({ email }).select(select).lean()
 //if(result){
  //res.json({
    //message:'Email id is already register',
   // alert: false
  //})
 //}else{
  //const data = userModel(req.body);
   //   const save = data.save();
   //   res.send({ message: "Successfully sign up", alert: true });
 //}

  // userModel.findOne({ email: email }, (err, result) => {
  //   console.log(result);
  //   console.log(err);
  //   if (result) {
  //     res.send({ message: "Email id is already register", alert: false });
  //   } else {
  //     const data = userModel(req.body);
  //     const save = data.save();
  //     res.send({ message: "Successfully sign up", alert: true });
  //   }
  // });

  // app.post("/signup", async (req, res) => {
  //   console.log(req.body);
  //   const { email } = req.body;
  
  //   try {
  //     const result = await userModel.findOne({ email: email }).exec();
  //     console.log(result);
  //     if (result) {
  //       res.send({ message: "Email id is already registered", alert: false });
  //     } else {
  //       const data = userModel(req.body);
  //       const save = await data.save();
  //       res.send({ message: "Successfully signed up", alert: true });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send({ message: "Internal server error" });
  //   }
  // });


  //api login
//    const bcrypt = require('bcrypt');

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await userModel.findOne({ email: email }).exec();

//     if (user) {
//       const match = await bcrypt.compare(password, user.password);

//       if (match) {
//         const dataSend = {
//           email: user.email,
//           password: user.password,
//           image: user.image,
//         };

//         res.send({ message: "Logged in successfully", alert: true, data: dataSend });
//       } else {
//         res.send({ message: "Invalid password", alert: false });
//       }
//     } else {
//       const data = userModel(req.body);
//       const save = await data.save();
//       res.send({ message: "Login failed, please try again or sign up", alert: false });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Error" });
//   }
// });



  app.post("/login",async (req, res) => {
    // console.log(req.body);
    // const { email } = req.body;
    
    // const { email,password } = req.body;
    try {
      const { email,password } = req.body;
      const result = await userModel.findOne({ email: email,password: password }).exec();
      
      
      if (result) {
       
        const dataSend = {
          _id: result._id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          // password: result.password,
          image: result.image,
        };
        console.log(dataSend)
        res.send({ message: "Logged in successfully", alert: true,data : dataSend });
      } else {
      const data = userModel(req.body);
      const save = await data.save();
      res.send({ message: "Login failed try again or signup, pless", alert: false});
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Error password" });
    }
  });



  //product section
  const schemaProduct = mongoose.Schema({
    name: String,
    category:String,
    image: String,
    price: String,
    description: String,
  });
  const productModel = mongoose.model("product",schemaProduct)

//save product in data 
//api
app.post("/uploadProduct",async(req,res)=>{
  console.log(req.body)
  const data = await productModel(req.body)
  const datasave = await data.save()
  res.send({message : "Upload successfully"})
})

app.get("/product",async(req,res)=>{
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
  // res.send("data")
})


//server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
