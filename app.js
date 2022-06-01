const path = require('path')
const mariadb = require('mariadb');
var express = require('express');
// const cors = require("cors")
const bodyParser = require("body-parser")
var app = express();
var pool = require('../Back-End/connection')
app.use(bodyParser.urlencoded({extended: false}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/', async function (req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    let clients = await conn.query("SELECT * FROM client");
    delete clients.meta
    res.json(clients);
    
  } catch (err) {
    res.send(err);  
    // throw err;
      
  } finally {
      if (conn) return conn.end();
  }
});

// app.get('/create-user', (req, res) => {
//   res.render('creatcl')
// })

app.post('/insert-user', async (req, res) => {

  let data = req.body
  let companyName = data['companyName'];
  let Email = data.Email;
  let Name = data.Name;
  let fileName = data.fileName;
  let API = data.API;
  let conn;
  if(companyName=="" || Email=="" || Name=="" || fileName=="" || API==""){
    status=0;
    res.send({status});
  }
  else{
    try {   
      console.log(data)
      conn = await pool.getConnection();
      await conn.query("INSERT INTO client (company_name, contact_person, file_names, email, api_key) VALUES ('"+companyName+"','"+Name+"','"+fileName+"','"+Email+"','"+API+"')");
      var status=1;
      res.send({status})
    } catch (err) {  
      status = 2;   
      res.send({status});
    } 
  }
    if (conn) return conn.end();
});

app.post('/admin-user', async (req, res) => {
  let data = req.body
  let username = data.username;
  let password = data.password;
  console.log(data)
  
  try {
    console.log("enter checking")
    if(username=="admin"&&password=="admin"){
      var loginstatus=1;
      res.send({loginstatus})
    }
    if(username!="admin"&&password=="admin"){
      var loginstatus=2;
      res.send({loginstatus})
    }
    if(username=="admin"&&password!="admin"){
      var loginstatus=3;
      res.send({loginstatus})
    }
    if(username!="admin"&&password!="admin"){
      var loginstatus=0;
      res.send({loginstatus})
    }
    
  } catch (err) {
    res.send(err);  
  } 
})

app.get('/add-license', async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection();
    let clients = await conn.query("SELECT * FROM client");
    delete clients.meta
    let license = await conn.query("SELECT * FROM license");
    delete license.meta
    // console.log(clients)
    // console.log(license)
    let objects = {clients,license}
    // console.log(objects)
    res.json(license);
    
  } catch (err) {
    res.send(err);  
  } finally {
      if (conn) return conn.end();
  }
})

app.post('/check-api', async (req, res) => {
  let conn
  let data = req.body
  let api = data.API;
  let statu
  try {
    conn = await pool.getConnection();
    let apiResult = await conn.query(`SELECT __kp__clientid__lsan FROM client WHERE api_key= '${api}'`);
    delete apiResult.meta
    console.log(apiResult)
    // let objects = {apiResult}
    if(apiResult){
      statu = 1
      res.json(statu)
    }
    
  } catch (err) {
    statu = 0
    console.log(err)
    res.json(statu);  
  }
  if (conn) return conn.end();
})

app.post('/make-subs', async (req, res) => {

  let data = req.body
  let clientId = data.clientId
  let licenseId = data.licenseId
  let startDate = data.startDate
  let endDate = data.endDate
  let noofUsers = data.noofUsers
  let serverStatus = data.server
  let conn;
  if(clientId=="" || licenseId=="" || startDate=="" || endDate=="" || noofUsers==""){
    status=0;
    res.send({status});
  }
  else{
    try {   
      console.log(data)
      conn = await pool.getConnection();
      await conn.query("INSERT INTO subsciption (_kf__clientid__lsxn, _kf__licenseid__lsxn, start_date, end_date, no_of_user, is_server) VALUES ('"+clientId+"','"+licenseId+"','"+startDate+"','"+endDate+"','"+noofUsers+"','"+serverStatus+"')");
      var status=1;
      res.send({status})
    } catch (err) {     
      res.send(err);
    } 
  }
  if (conn) return conn.end();
});

app.post('/view-subs', async (req, res) => {

  let data = req.body
  let clId = data.clientId 
  let conn;
  try {
    conn = await pool.getConnection();
    let clientSubs = await conn.query(`SELECT * FROM subsciption where _kf__clientid__lsxn = ${clId}`);
    delete clientSubs.meta
    res.json(clientSubs);
    
  } catch (err) {
    res.send(err);  
  }
  if (conn) return conn.end();
});

app.post('/client-license', async (req, res) => {

  let data = req.body
  let lId = data.licenseId 
  let conn;
  try {
    conn = await pool.getConnection();
    let clientSubs = await conn.query(`SELECT name,version,type FROM license where __kp__licenseid__lsan = ${lId}`);
    delete clientSubs.meta
    res.json(clientSubs);
    
  } catch (err) {
    res.send(err);  
  }
  if (conn) return conn.end();
});

app.post('/update-subs', async (req, res) => {

  let data = req.body
  let subscriptionId = data.subscriptionId
  let clientId = data.clientId
  let licenseId = data.licenseId
  let startDate = data.eStartDate
  let endDate = data.eEndDate
  let noofUsers = data.eNoUsers
  let serverStatus = data.server
  let conn;
  if(clientId=="" || licenseId=="" || startDate=="" || endDate=="" || noofUsers==""){
    status=0;
    res.send({status});
  }
  else{
    try {   
      console.log(data)
      conn = await pool.getConnection();
      await conn.query(`UPDATE subsciption SET _kf__clientid__lsxn = '${clientId}', _kf__licenseid__lsxn = '${licenseId}', start_date = '${startDate}', end_date = '${endDate}', no_of_user = '${noofUsers}', is_server = '${serverStatus}' WHERE __kp__subsid__lsan = '${subscriptionId}'`);
      var status=1;
      res.send({status})
    } catch (err) {     
      res.send(err);
    } 
  }
  if (conn) return conn.end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
