var express = require('express');
var router = express.Router();
const connection = require('./js/connt');
//解决跨域问题
router.all('*', function(req, res, next) {
//	res.header("Access-Control-Allow-Origin", "*");
//	res.header("Access-Control-Allow-Headers", "authorization");
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'authorization')
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

//商品添加
router.post('/addcomm', function(req, res, next) {
	//	res.send('添加用户后台成功')
	let {
		commodityName,
		commodityBarCode,
		commodityInPrice,
		commodityOutPrice,
		commodityInStock,
		commodityClassify,
		commodityDesc,
		commodityMarketPrice,
		commodityUnit
	} = req.body;
	let sql = `INSERT INTO comm(commodityName, commodityBarCode, commodityInPrice ,commodityOutPrice,commodityInStock,commodityClassify,commodityDesc,commodityMarketPrice,commodityUnit) VALUES('${commodityName}','${commodityBarCode}','${commodityInPrice}','${commodityOutPrice}','${commodityInStock}','${commodityClassify}','${commodityDesc}','${commodityMarketPrice}','${commodityUnit}')`;
	//	let sql = INSERT INTO users("group","userName","passWord","checkPass","userTel","userDesc") VALUES('${group}','${userName}','${passWord}','${checkPass}','${userTel}','${userDesc}')
	connection.query(sql, function(err, data) {
		if(err) throw err;

		//		console.log(data)
		if(data.affectedRows > 0) {
			res.send({
				code: true,
				message: `商品添加成功`
			})
		} else {
			res.send({
				code: false,
				message: `添加失败!!请重试`
			})
		}
	});
})

//商品列表获取
router.get('/commList', function(req, res, next) {
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
		pageSize,
		commodityName,
		commodityClassify
	} = req.query;
	var total;

	var sql = `SELECT * FROM comm where 1=1`;
	
	// 如果分类不等于空 且 不等于全部
	if (commodityClassify !== '' && commodityClassify !== '全部分类') {
		// 拼接第一个查询条件
		sql += ` and commodityClassify='${commodityClassify}'`;
	}

	// 如果第二个关键字不为空 那么就拼接sql
	if (commodityName !== '') {
		sql += ` and (commodityName like '%${commodityName}%' or commodityBarCode like '%${commodityName}%')`
	}

	// 拼接排序
	sql += ` order by id desc`
	
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
			console.log(data)

		res.send({
			total,
			data
		})
	});

	//	res.send(total)
})

//商品删除
router.get('/removecomm', function(req, res, next) {
	//	res.send('用户登录后台成功')
	let {
		id
	} = req.query;
	//	console.log(userName, passWord);
	//查
	var sql = `DELETE FROM comm where id='${id}'`;

	connection.query(sql, function(err, data) {
		if(err) throw err;
		//		console.log(result)
		if(data.affectedRows > 0) {
			res.send({
				code: true,
				message: `成功删除此商品`
			})
		} else {
			res.send({
				code: false,
				message: `删除失败`
			})
		}
	});
})

//商品批量删除
router.get('/removecomms', function(req, res, next) {
	//	res.send('用户登录后台成功')
	let {
		id
	} = req.query;
	console.log(id);

	//查
	var sql = `DELETE FROM comm where id in (${id})`;

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

//商品修改的查询
router.get('/setcomm', function(req, res, next) {
	let {
		id
	} = req.query;

	//查
	var sql = `SELECT * FROM comm where id='${id}'`;
	connection.query(sql, function(err, data) {
		if(err) throw err;
		//				console.log(data) 

		res.send(data)
	});
})

//商品修改
router.post('/setcomm', function(req, res, next) {
	//	res.send('添加用户后台成功')
	let {
		commodityClassify, //优惠
		commodityInStock,
		commodityOutPrice,
		commodityName,
		resetUserId
	} = req.body;
	let sql = `UPDATE comm SET commodityClassify="${commodityClassify}", commodityName='${commodityName}',commodityInStock='${commodityInStock}',commodityOutPrice='${commodityOutPrice}' WHERE id="${resetUserId}"`;

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

module.exports = router;