const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

router.get('/', (req,res) =>{
  res.sendFile(path.join(__dirname, "/login.html"))
});


router.post('/login', (req,res) =>{
  console.log(req.body);
  const username = "sunder"; 
  const password = "pw"; 
  if (req.body.username === username && req.body.password === password){
    const data = require('./data.json');
    console.log("success");
    res.status(200).send(data);
  }
  else{
    console.log("fail");
    res.status(500).send("fail");
  }
});


router.get("/todos",(req,res) => {
  var data = fs.readFileSync("data.json");
  data = JSON.parse(data);
  res.status(200).send(data);
});


router.post("/todos",(req,res) => {
  var data =fs.readFileSync("data.json");
  data = JSON.parse(data);

  data.push({
    title : req.body.title,
    description : req.body.description,
    status : req.body.status,
  });
  var newData = JSON.stringify(data);
  fs.writeFile("data.json", newData, (err) => {
    //error checking
    if (err) throw err;

    console.log("new data added");
  });

  res.status(200).send(newData);
});


router.put("/todos/:title",(req,res) => {
  const { title } = req.params;
  var data =fs.readFileSync("data.json");
  data = JSON.parse(data);
  data.forEach( (obj) => {
    if (obj.title === title) {
      obj.description = req.body.description;
      obj.status = req.body.status;
    }
  });
  fs.writeFile("data.json", JSON.stringify(data), (err) => {
    //error checking
    if (err) throw err;

    console.log("Data updated");
  });
  res.send(data);
});


router.delete("/todos/:title",(req,res) => {
  const { title } = req.params;
  var data =fs.readFileSync("data.json");
  data = JSON.parse(data);

  const filterdata =data.filter( (obj) => {
    if (obj.title != title) return obj;
  });

  var newData = JSON.stringify(filterdata);
  fs.writeFile("data.json", newData, (err) => {
    if (err) throw err;

    console.log("Data deleted");
  });

  res.status(200).send(newData);
});


router.get('/register', (req,res) =>{
  res.send("register trying");
});


router.get('/logout', (req,res) =>{
  res.send("logout trying");
});


app.use("/", router);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
