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

/* --- 验证token合法性开始 ---- */

// 引入express-jwt模块 此模块主要用于验证token的合法性
const expressJwt = require('express-jwt');
//定义秘钥
const secret = 'mysecret';

// 验证token合法性（检查用户携带的token是否正确）
router.use(expressJwt({
	secret
}).unless({
	path: ['/login/userlogin'] // 不需要验证的url
}))

// 如果token不正确，就会抛出错误，如果错误的名字是“UnauthorizedError” 可以断定就是token无效的错误
router.use(function(err, req, res, next) {
	if(err.name === 'UnauthorizedError') {
		// token无效 就给前端浏览器响应401状态码 且响应错误提示信息 
		res.status(401).send('无效的token，前端发送的请求，必须在请求头上携带token，才能拿到数据哦！');
	}
})

/* --- 验证token合法性结尾 ---- */

//会员是否存在验证,存在返回该会员信息
router.get('/vipuser', function(req, res, next) {
	//	res.send('用户登录后台成功')
	let {
		vipUserNum
	} = req.query;
	//	console.log(userName, passWord);
	//查
	var sql = `SELECT * FROM vipuser where vipUserNum='${vipUserNum}' or vipUserName='${vipUserNum}' or vipUserTel='${vipUserNum}'`;

	connection.query(sql, function(err, data) {
		if(err) throw err;

		if(data.length > 0) {
			res.send({
				code: true,
				message: `用户存在`,
				data: data[0]
			})
		} else {
			res.send({
				code: false,
				message: `用户不存在`
			})
		}
	});
})

//商品的查询
router.get('/setcomm', function(req, res, next) {
	let {
		commodityBarCode
	} = req.query;

	//查
	var sql = `SELECT * FROM comm where commodityBarCode='${commodityBarCode}'`;
	connection.query(sql, function(err, data) {
		if(err) throw err;
		res.send(data)
	});
})

//出库记录添加
router.post('/addoutcomm', function(req, res, next) {
	//	res.send('添加用户后台成功')
	let {
		ordernumber,
		commodityBarCode,
		salePrice,
		discountsPrice,
		discount,
		outNumber,
		commodityTotol,
		status,
		commodityName
	} = req.body;
	let sql = `INSERT INTO commrecord(ordernumber, commodityBarCode, salePrice ,discountsPrice,discount,outNumber,commodityTotol,status,commodityName) VALUES('${ordernumber}','${commodityBarCode}','${salePrice}','${discountsPrice}','${discount}','${outNumber}','${commodityTotol}','${status}','${commodityName}')`;
	//	let sql = INSERT INTO users("group","userName","passWord","checkPass","userTel","userDesc") VALUES('${group}','${userName}','${passWord}','${checkPass}','${userTel}','${userDesc}')
	connection.query(sql, function(err, data) {
		if(err) throw err;

		//		console.log(data)
		if(data.affectedRows > 0) {
			res.send({
				code: true,
				message: `商品出库成功`
			})
		} else {
			res.send({
				code: false,
				message: `商品出库失败`
			})
		}
	});
})

//商品出库记录查询
router.get('/outcommList', function(req, res, next) {

	//差所有用户带有分页,并按照最新时间在前排序
	let {
		currentPage,
		pageSize,
		commodityName,

	} = req.query;
	var total;

	var sql = `SELECT * FROM commrecord where 1=1`;

	// 如果分类不等于空 且 不等于全部
	//	if (commodityClassify !== '' && commodityClassify !== '全部分类') {
	//		// 拼接第一个查询条件
	//		sql += ` and commodityClassify='${commodityClassify}'`;
	//	}

	// 如果第二个关键字不为空 那么就拼接sql
	if(commodityName !== '') {
		sql += ` and (commodityName like '%${commodityName}%')`
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
	console.log(sql)
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

//退货查询
router.get('/outcommLists', function(req, res, next) {

	//差所有用户带有分页,并按照最新时间在前排序
	let {
		currentPage,
		pageSize,
		ordernumber,
	} = req.query;
	var total;

	var sql = `SELECT * FROM commrecord where 1=1`;

	// 如果分类不等于空 且 不等于全部
	//	if (commodityClassify !== '' && commodityClassify !== '全部分类') {
	//		// 拼接第一个查询条件
	//		sql += ` and commodityClassify='${commodityClassify}'`;
	//	}

	// 如果第二个关键字不为空 那么就拼接sql
	if(ordernumber !== '') {
		sql += ` and (ordernumber like '%${ordernumber}%')`
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

//退货操作
router.post('/returncomm', function(req, res, next) {
	//	res.send('添加用户后台成功')
	let {
		ordernumber,
		commodityBarCode,
		salePrice,
		discountsPrice,
		discount,
		outNumber,
		commodityTotol,
		status,
		commodityName
	} = req.body;
	let returnordernumber=Date.now();
	let sql = `INSERT INTO reutrncomm(ordernumber, commodityBarCode, salePrice ,discountsPrice,discount,outNumber,commodityTotol,status,commodityName,returnordernumber) VALUES('${ordernumber}','${commodityBarCode}','${salePrice}','${discountsPrice}','${discount}','${outNumber}','${commodityTotol}','${status}','${commodityName}','${returnordernumber}')`;
	//	let sql = INSERT INTO users("group","userName","passWord","checkPass","userTel","userDesc") VALUES('${group}','${userName}','${passWord}','${checkPass}','${userTel}','${userDesc}')
	connection.query(sql, function(err, data) {
		if(err) throw err;

		//		console.log(data)
		if(data.affectedRows > 0) {
			res.send({
				code: true,
				message: `商品退货成功`
			})
		} else {
			res.send({
				code: false,
				message: `商品退货失败`
			})
		}
	});
})

module.exports = router;