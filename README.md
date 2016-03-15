# nodejs-mysql-queries
> Execute multiple queries with only one callback for MySQL.

## Install

```sh
$ npm install mysql-queries --save
```

## How to Use

Init `mysql-queries` to somewhere,such as app.js of `Express`:
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
```js
var sqlclient = require('mysql-queries');
//Execute multiple SQLs, like this:
    sqlclient.queries(['SELECT * FROM prod_unit WHERE NAME=? limit 1',
	  'INSERT INTO prod_unit(name) values(?)',
	  'INSERT INTO product(name, type_id, unit_id, price) VALUES(?, ?, ?, ?)'],
	  [[data.unit_name],[data.unit_name],[data.name,data.type_id,data.unit_id,data.price]], {
	  beforeQuery:function(i, arg, results) {
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
	  if(!err) {
		//If not error, the parameter "results" is a array,results of the SQLs.
	    console.log(results);
	  } else {
	    console.log(err);
	  }
	});
  
//Also, you can execute with only one SQL, like this:
	sqlclient.query('SELECT * FROM prod_unit', , function(err, result){
	  if(!err) {
		//If not error, the parameter "result" is the result of the SQL.
	    console.log(result);
	  } else {
	    console.log(err);
	  }
	});
```

## Features
* Less code when executing multiple SQLs
* Support transaction of connection
* Support connection pool
* Auto release the connection

## Running Tests

With your MySQL configured on `./test/mysql.json, running tests is as simple as:
```
npm test
```