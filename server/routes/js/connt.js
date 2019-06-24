
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'www.xiangpengfei.cn',
  user     : 'root',
  password : 'root',
  database : 'somefresh'
});
 
connection.connect();
 console.log("success")
 module.exports = connection;
