var express = require('express');
var router = express.Router();
const connection = require('./js/connt');
//解决跨域问题
router.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "authorization");
	//	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	//	res.header("X-Powered-By", ' 3.2.1')
	//	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

/* GET users listing. */
//router.get('/', function(req, res, next) {
//res.send('respond with a resource');
//});


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

//用户注册
router.post('/useradd', function(req, res, next) {
	//	res.send('添加用户后台成功')
	let {
		group,
		userName,
		passWord,
		checkPass,
		userTel,
		userDesc
	} = req.body;
	let sql = `INSERT INTO users(userName, passWord, userTel, userGroup ,userDesc) VALUES('${userName}','${passWord}','${userTel}','${group}','${userDesc}')`;
	//	let sql = INSERT INTO users("group","userName","passWord","checkPass","userTel","userDesc") VALUES('${group}','${userName}','${passWord}','${checkPass}','${userTel}','${userDesc}')
	connection.query(sql, function(err, data) {
		if(err) throw err;

		//		console.log(data)
		if(data.affectedRows > 0) {
			res.send({
				code: true,
				message: `用户添加成功`
			})
		} else {
			res.send({
				code: false,
				message: `添加失败`
			})
		}
	});
})

//用户名是否存在验证
router.get('/useradd', function(req, res, next) {
	//	res.send('用户登录后台成功')
	let {
		user
	} = req.query;
	//	console.log(userName, passWord);
	//查
	var sql = `SELECT * FROM users where userName='${user}'`;

	connection.query(sql, function(err, data) {
		if(err) throw err;
		//		console.log(result)
		if(data.length > 0) {
			res.send({
				code: true,
				message: `用户存在`
			})
		} else {
			res.send({
				code: false,
				message: `用户不存在`
			})
		}
	});
})

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
			res.send({
				code: true,
				message: `${userName},欢迎登录`
			})
		} else {
			res.send({
				code: false,
				message: `登录失败,账号或密码错误`
			})
		}
	});
})

//用户列表获取
router.get('/userlist', function(req, res, next) {
	//查所有用户,并按照最新时间在前排序
	//	var sql = `SELECT * FROM users ORDER BY ctime DESC`;
	//	connection.query(sql, function(err, data) {
	//		if(err) throw err;
	//		//		console.log(result)
	//		res.send(data)
	//	});

	//差所有用户带有分页,并按照最新时间在前排序
	let {
		currentPage,
		pageSize
	} = req.query;
	var total;

	var sql = `SELECT * FROM users ORDER BY ctime DESC`;
	connection.query(sql, function(err, data) {
		if(err) throw err;
		//		console.log(data.length)
		total = data.length;
		//		console.log(total)
	});
	let num = (currentPage - 1) * pageSize
	//	limit ${n}, ${pageSize}
	console.log(currentPage)
	sql += ` limit ${num},${pageSize}`;
	connection.query(sql, function(err, data) {
		if(err) throw err;
		//	console.log(data)

		res.send({
			total,
			data
		})
	});

	//	res.send(total)
})

//用户删除
router.get('/removeuser', function(req, res, next) {
	//	res.send('用户登录后台成功')
	let {
		id
	} = req.query;
	//	console.log(userName, passWord);
	//查
	var sql = `DELETE FROM users where id='${id}'`;

	connection.query(sql, function(err, data) {
		if(err) throw err;
		//		console.log(result)
		if(data.affectedRows > 0) {
			res.send({
				code: true,
				message: `成功删除用户`
			})
		} else {
			res.send({
				code: false,
				message: `删除失败`
			})
		}
	});
})

//用户批量删除
router.get('/removeusers', function(req, res, next) {
	//	res.send('用户登录后台成功')
	let {
		id
	} = req.query;
	console.log(id);

	//查
	var sql = `DELETE FROM users where id in (${id})`;

	connection.query(sql, function(err, data) {
		if(err) throw err;
		//		console.log(result)
		if(data.affectedRows > 0) {
			res.send({
				code: true,
				message: `成功删除用户`
			})
		} else {
			res.send({
				code: false,
				message: `删除失败`
			})
		}
	});
})

//用户修改的查询
router.get('/setuser', function(req, res, next) {
	let {
		id
	} = req.query;

	//查
	var sql = `SELECT * FROM users where id='${id}'`;
	connection.query(sql, function(err, data) {
		if(err) throw err;
		//				console.log(data) 

		res.send(data)
	});
})

//用户修改
router.post('/setuser', function(req, res, next) {
	//	res.send('添加用户后台成功')
	let {
		userGroup,
		userName,
		userTel,
		resetUserId
	} = req.body;
	let sql = `UPDATE users SET userGroup="${userGroup}", userName='${userName}',userTel='${userTel}' WHERE id="${resetUserId}"`;

	//	let sql = `INSERT INTO users(userName, passWord, userTel, userGroup ,userDesc) VALUES('${userName}','${passWord}','${userTel}','${group}','${userDesc}')`;
	//	let sql = INSERT INTO users("group","userName","passWord","checkPass","userTel","userDesc") VALUES('${group}','${userName}','${passWord}','${checkPass}','${userTel}','${userDesc}')
	connection.query(sql, function(err, data) {
		if(err) throw err;

		//		console.log(data)
		if(data.affectedRows > 0) {
			res.send({
				code: true,
				message: `用户修改成功`
			})
		} else {
			res.send({
				code: false,
				message: `用户修改失败`
			})
		}
	});
})

//密码修改
router.post('/resetuserpwd', function(req, res, next) {
	//	res.send('添加用户后台成功')
	let {
		id,
		passWord,
		newuserpwd
	} = req.body;
	//		console.log(id,passWord,newuserpwd)

	//查
	var sql = `SELECT * FROM users where id='${id}'`;
	connection.query(sql, function(err, data) {
		if(err) throw err;
		console.log(data[0])
		if(data[0].passWord === passWord) { //判断旧密码是否通过验证
			//改
			let sqlset = `UPDATE users SET passWord="${newuserpwd}" WHERE id="${id}"`;
			connection.query(sqlset, function(err, data) {
				if(err) throw err;
				if(data.affectedRows > 0) {
					res.send({
						code: true,
						message: `用户修改成功`
					})
				} else {
					res.send({
						code: false,
						message: `用户修改失败`
					})
				}
			});
		} else {
			res.send({
				code: false,
				message: `原密码输入错误`
			})
		}

	});

})

/* 用户信息 */
router.get('/info', (req, res) => {
	// 获取id
	let id = req.user.id;

	// 构造sql
	const sqlStr = `select * from users where id=${id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if(err) throw err;
		res.send({
			data
		})
	})
})

/* -----上传开始---- */ 
// 引入node上传模块
var multer = require('multer');

// 配置存储路径 和 重命名
var storage = multer.diskStorage({
    // 图片上传到服务器以后 要放置的路径
    destination: 'public/upload',

    // 图片重命名
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
});

// 上传对象
var upload = multer({
    storage,
});

// 接收上传请求
router.post('/imageupload', upload.single('file'), (req, res) => {
    // 接收到的文件信息
	var file = req.file;
	console.log(file)

	// 文件名
	let fileName = file.filename;
	// 拼接文件路径
	let avatarUrl = '/upload/' + fileName

	// 构造sql
	const sqlStr = `update users set userInfo = '${avatarUrl}' where id=${req.user.id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: "上传成功", avatarUrl})
		} else {
			res.send({code: 1, reason: "上传失败"})
		}
	})
})

/* ----上传结束----- */ 

module.exports = router;