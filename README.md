# nodejs-mysql-queries
> Execute multiple queries with only one callback for MySQL.

## Install

```sh
$ npm install mysql-queries --save
```

## How to Use

Init `mysql-queries` to somewhere,such as `app.js` of `Express`, like this:
```js
var options = {
	host: 'localhost',
	port: 3306,
	user: 'db_user',
	password: 'password',
	database: 'db_name'
};

require('mysql-queries').init(options);
```
Use it to some other module, like this:

* Execute SQLs directly

```js
var sqlclient = require('mysql-queries'),
  sqls = ['SELECT * FROM prod_unit WHERE NAME=? limit 1',
  'INSERT INTO prod_unit(name) values(?)',
  'INSERT INTO product(name, type_id, unit_id, price) VALUES(?, ?, ?, ?)'];
  
sqlclient.queries(sqls,
  [[data.unit_name],[data.unit_name],[data.name,data.type_id,data.unit_id,data.price]], 
  function(err, results){
	if(!!err) {
	  console.log(err);
	} else {
	//If not error, the "results" is the results of the SQLs as array.
	  console.log(results);
	}
  });
```

* Execute SQLs with condiction

```js
sqlclient.queries(sqls,
  [[data.unit_name],[data.unit_name],[data.name,data.type_id,data.unit_id,data.price]], {
  skip:function(i, arg, results) {
	var skip = false;
	switch(i) {
	  case 1:
	  //handle second SQL
	  //Execute the second SQL depending on the first SQL result.
	  skip = results[0].length!==0;
	  break;
	case 2:
	  //If the second SQL executed, passing the "insertId" to the third SQL as parameter.
	  if(results[0].length===0) {
		arg[2]=results[1].insertId;
	  }
	  break;
	}
	return skip;
  }
}, function(err, results){
  if(!!err) {
	console.log(err);
  } else {
	//If not error, the "results" is the results of the SQLs as array.
	console.log(results);
  }
});
```

* Execute only one SQL

```js
sqlclient.query('SELECT * FROM prod_unit', function(err, result){
  if(!!err) {
	console.log(err);
  } else {
	console.log(result);
  }
});
```

## Features
* Less code when executing multiple SQLs
* Support transaction of connection
* Support connection pool
* Auto release the connection

## Running Tests

With your correct configured of MySQL on `./test/mysql.json`, running tests is as simple as:
```
npm test
```