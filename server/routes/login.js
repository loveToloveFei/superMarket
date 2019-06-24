var express = require('express');
var router = express.Router();
const connection = require('./js/connt');
const jwt = require('jsonwebtoken');
//解决跨域问题
router.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "authorization");
//	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//	res.header("X-Powered-By", ' 3.2.1')
//	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});



/* --- 验证token合法性开始 ---- */ 

	// 引入express-jwt模块 此模块主要用于验证token的合法性
	const expressJwt = require('express-jwt');
	//定义秘钥
	const secret = 'mysecret';

	// 验证token合法性（检查用户携带的token是否正确）
	router.use(expressJwt ({
	    secret 
	}).unless({
	    path: ['/login/userlogin']  // 不需要验证的url
	}))

	// 如果token不正确，就会抛出错误，如果错误的名字是“UnauthorizedError” 可以断定就是token无效的错误
	router.use(function (err, req, res, next) {
	    if (err.name === 'UnauthorizedError') {  
	    	// token无效 就给前端浏览器响应401状态码 且响应错误提示信息 
	        res.status(401).send('无效的token，前端发送的请求，必须在请求头上携带token，才能拿到数据哦！');
	    }
	})

/* --- 验证token合法性结尾 ---- */ 

//用户登录验证
router.post('/userlogin', function(req, res, next) {
	//	res.send('用户登录后台成功')
	let {
		userName,
		passWord
	} = req.body;
	//	console.log(userName, passWord);

	var sql = `SELECT * FROM users where userName='${userName}' && passWord='${passWord}'`;
	//查
	connection.query(sql, function(err, data) {
		if(err) throw err;
		//		console.log(result)
		if(data.length > 0) {
			//生成token
			const token = jwt.sign(Object.assign({},data[0]), secret, {
				expiresIn: 60*60*24  // 过期时间
			});
			res.send({
				code: true,
				message: `${userName},欢迎登录`,
				token,
				username:data[0].userName,
				userid:data[0].id
			})
		} else {
			res.send({
				code: false,
				message: `登录失败,账号或密码错误`
			})
		}
	});
})

module.exports = router;