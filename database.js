var mysql=require('mysql'),
    credentials=require('./credentials.json');

credentials.database = "MinecraftDB";

var Promise = require('bluebird');
var using = Promise.using;
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var tableinf = [];
var pool = mysql.createPool(credentials);

var getConnection=function(){
    return pool.getConnectionAsync().disposer(
        function(connection){
            return connection.release();
        }
    );
};

module.exports.query = function(command) {
    return using(getConnection(),function(connection){
        return connection.queryAsync(command);
    });
};