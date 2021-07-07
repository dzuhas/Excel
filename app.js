const express = require('express');
const uuid = require('uuid').v4;
const multer = require('multer');
const xlsx = require('xlsx');
xlsxj = require("xlsx-to-json");
const fs = require("fs");

const path= require('path');
const app = express();
app.listen(3001, ()=> console.log("App is listening..."));
app.use(express.static(
    path.join(__dirname,'public'),));
console.log("opijajej");
//app.use(
  //  express.urlencoded({
    //  extended: true
    //})
  //);
app.use(express.json());

app.post('/upload',(req, res) =>{
  
  console.log("ejze");
  console.log(req.body);


    var name = req.body;
    console.log(name);
    

return res.json({status:"akuku"+req.body})
});
