var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.sqlite3');

function init(){
  db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS loggers (event TEXT)");
  });
}

function runQuery(sql, callback){
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    callback(rows);
  });
}

function runInsert(sql){
  db.run(sql);
}

function close(){
  db.close();
}

init();


module.exports = {
  runQuery,
  runInsert,
  close,
  db
};