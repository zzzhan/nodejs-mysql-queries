# nodejs-mysql-queries
> Execute multiple queries with only one callback for MySQL.

## Install

```sh
$ npm install mysql-queries --save
```

## How to Use

Init `mysql-queries` to somewhere,such as app.js of 'Express:
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
  function(data, callback) {
    sqlclient.queries(['SELECT * FROM prod_unit WHERE NAME=? limit 1',
	  'INSERT INTO prod_unit(name) values(?)',
	  'INSERT INTO product(name, type_id, unit_id, price) VALUES(?, ?, ?, ?)'],
	  [[data.unit_name],[data.unit_name],[data.name,data.type_id,data.unit_id,data.price]], {
	  beforeQuery:function(i, arg, results) {
		var skip = false;
		switch(i) {
		  case 1:
		  //handle second sql
		  //if the first sql empty,create a new one
		  skip = results[0].length!==0;
		  break;
		case 2:
		  //use the second result,and pass to the third sql as parameter
		  if(results[0].length===0) {
		    arg[2]=results[1].insertId;
		  }
		  break;
		}
		return skip;
	  }
	}, callback);
  }
  
//Execute with only one SQL, like this:
  function(callback) {
	sqlclient.query('SELECT * FROM prod_unit', callback);
  }
```

## Running Tests

With your local environment configured, running tests is as simple as:
```
npm test
```