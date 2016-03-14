var env = process.env.NODE_ENV || 'development',  
  mysqlConfig = require('./mysql.json'),
  cfg = mysqlConfig[env]||mysqlConfig,
  sqlclient = require('../lib/mysql-queries').init(cfg),
  id='root';
sqlclient.queries(['SELECT host FROM user where user=? limit 1',
  'SELECT user FROM user where user=? limit 1',
  'SELECT password FROM user where user=? limit 1'], [[id],[id],[id]], {
	  beforeQuery:function(i, arg, results) {
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
		console.log(results);
	  }
  });
  
sqlclient.query('SELECT host FROM user where user=? limit 1', [id], function(err, results){
  if(!!err) {
	console.error(err);
  } else {
	console.log(results);
  }
});