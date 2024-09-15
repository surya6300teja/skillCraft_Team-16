require('dotenv').config();
const express = require('express')
const mongoose=require('mongoose')
const cors =require('cors')
const PORT = process.env.PORT|| 8080;
const router=require('./routes/route')
const app = express()
app.use(express.json())
app.use(cors())
app.use('/',router)

app.listen(PORT,()=>{
    console.log("server is running")
})

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("the database is connected");
})
.catch(err=>{
    console.log(err)
})