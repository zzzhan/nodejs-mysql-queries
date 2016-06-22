var mysql = require('mysql'),
	async = require('async'),
	defKey = '__myqueries',
    Queries = function(pool) {
	  this._pool = pool;
    };
  Queries.prototype = {
	query: function(sql, args, callback){
	  var self=this,pool=self._pool;
	  pool.query(sql, args, function(err, res) {
		callback.apply(null, [err, res]);
	  });
	},
	queries:function(queries, args, opt, callback) {
	  var self=this,pool=self._pool;
	  if(callback===undefined) {
		callback = opt;
	  }
	  pool.getConnection(function(err, conn){
		if(!!err) {
		  callback(err);
		} else {
		  conn.beginTransaction(function(err) {
			if(!!err) {
			  callback(err);
			} else {
			  var arr = [],results=[],
				func = function(conn, i, queries, args, opt) {
				  return function(cb) {
					var skip = false;
					if(!!opt&&typeof opt.skip==='function') {
					  try {
					    skip = opt.skip(i, args[i], results, cb);
					  } catch(e) {
						cb(e);
						return;
					  }
					}
					if(!skip) {
					  conn.query(queries[i], args[i], function(err, rs){
						results[i]=rs;
						cb(err, rs);
					  });
					} else {	
					  cb();
					}
				  };
				};
			  for(var i=0;i<queries.length;i++) {
				arr[arr.length] = func(conn, i, queries, args, opt);
			  }
			  async.series(arr, function(err, results){
				if(!!err) {				
				  conn.rollback();
				} else {
				  conn.commit(function(err) {
					if (!!err) { 
					  conn.rollback();
					}
				  });
				}
				conn.release();
				callback(err, results);
			  });
			}
		  });
		}
	  });
	}
  };
module.exports = {
  init: function(cfg, name) {
	var inst = new Queries(mysql.createPool(cfg));
	module.exports[name||defKey]=inst;
	return inst;
  },
  query: function(sql, args, callback, pool) {
	var inst = module.exports[pool||defKey];
	inst.query(sql, args, callback);
  },
  queries: function(sqls, args, opt, callback) {
	var inst = module.exports[opt.pool||defKey];
	inst.queries(sqls, args, opt, callback);
  }
};