var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection({
  host: 'localhost', // Replace with your host name
  user: 'root',      // Replace with your database username
  password: 'root',      // Replace with your database password
  database: 'leavedatabase' // // Replace with your database Name
});
con.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully!');
});
function getBusinessDatesCount(startDate, endDate) {
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  var count = 0;
  var curDate = startDate;

  while (curDate <= endDate) {
    var dayOfWeek = curDate.getDay();
    if(!((dayOfWeek == 6) || (dayOfWeek == 0)))
      count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/save', function(req,res){

  let sql = "select * from user where name =  ?";
  let sql1 = "update user set numLeave = ? where name = ?"
  let sql2  = "insert into user (name, numLeave) values (?, ?)"
  var count = 0;
  if(req.body.request == "whole" || req.body.request == "half"){
    count  = 24 - 1;
  }else{
    count = 24 - getBusinessDatesCount(req.body.from, req.body.to);
  }
  var name1 = req.body.name
  let query = con.query(sql, req.body.name, (err, results) =>{
    if(results.length > 0){
      con.query(sql, req.body.name, (err, results) =>{
        count = results[0].numLeave - count;
        name =  results[0].name;
        con.query(sql1, {count, name}, (err, results) => {
          res.redirect('/');
        });
      })
    }else{
      con.query(sql2, [name1,count], (err, results) =>{
        res.redirect('/');
      });
    }
  });
});

module.exports = router;
