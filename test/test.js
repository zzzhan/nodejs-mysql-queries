var env = process.env.NODE_ENV || 'development',  
  mysqlConfig = require('./mysql.json'),
  cfg = mysqlConfig[env]||mysqlConfig,
  sqlclient = require('../lib/mysql-queries').init(cfg),
  id='root',
  sqls = ['SELECT host FROM user where user=? limit 1',
  'SELECT user FROM user where user=? limit 1',
  'SELECT password FROM user where user=? limit 1'];
//Sample1:Execute multiple SQLs directly
sqlclient.queries(sqls, [[id],[id],[id]], function(err, results){
  if(!!err) {
	console.error(err);
  } else {
	console.log('SQLs Executed directly results(Sample1):');
	console.log(results);
	console.log('');
  }
});

//Sample2:Execute multiple SQLs with condiction
sqlclient.queries(sqls, [[id],[id],[id]], {
  skip:function(i, arg, results) {
	var skip = false;
	switch(i) {
	  case 1:
		//whether skip the update or not,according to the first query result
		skip = results[0].length===0;
		break;
	  case 2:
		//whether skip the delete or not,according to the first query result
		skip = results[0].length!==0;
		break;
	}
	return skip;
  }
}, function(err, results){
  if(!!err) {
	console.error(err);
  } else {
	console.log('Executed with condiction results(Sample2):');
	console.log(results);
	console.log('');
  }
});
//Sample3:Throw a error to break the execution
sqlclient.queries(sqls, [[id],[id],[id]], {
  skip:function(i, arg, results) {
	var skip = false;
	switch(i) {
	  case 1:
		skip = results[0].length===0;
		break;
	  case 2:
		throw 'Throw a error to break the execution.';
		//break;
	}
	return skip;
  }
}, function(err, results){
  if(!!err) {
	console.error('Sample error message(Sample3):');
	console.error(err);
	console.log('');
  } else {
	console.log(results);
  }
}); 
//Sample4:Execute only one SQL
sqlclient.query('SELECT host FROM user where user=? limit 1', [id], function(err, results){
  if(!!err) {
	console.error(err);
  } else {
	console.log('Only one SQL executed results(Sample4):');
	console.log(results[0]);
	console.log('');
  }
});