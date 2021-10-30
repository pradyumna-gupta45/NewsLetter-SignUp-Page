//jshint esversion: 6
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
  res.sendFile(__dirname+"/signup.html");
});


app.post("/", function(req,res){

const firstname=req.body.fname;
const lastname=req.body.lname;
const email=req.body.email;


const data={    // but this is javascript
  members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME:firstname,
          LNAME:lastname
        }
      }

  ]
};

//but we want tyo convert it into JSON, so :

const jsonData=JSON.stringify(data);  //we are going to send this to mailchimp

// https.get(url,function(){
//
// })
// it makes only get request but we want to post data to an external resource, so :

const url= "https://us5.api.mailchimp.com/3.0/lists/3490499850";
const options={
  method: "POST",
  auth: "prady:1d256cd8e8c58068b947892070676559-us5"
}

const request=https.request(url,options, function(response){

    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    } else{
    res.sendFile(__dirname+"/failure.html");
    }

  response.on("data", function(data){
    console.log(JSON.parse(data));
  })
})

request.write(jsonData);
request.end();

});


app.post("/failure", function(req, res){
  res.redirect("/");
});


app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000.");
});


 // my api key
//1d256cd8e8c58068b947892070676559-us5
// list id
// 3490499850
