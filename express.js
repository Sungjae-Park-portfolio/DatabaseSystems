var express=require('express'),
    mysql=require('mysql'),
    credentials=require('./credentials.json'),
    app = express(),
    port = process.env.PORT || 1337,
    db = require('./database.js');



app.use(express.static(__dirname + '/public'));
app.get("/items",function(req,res){
    var sql = 'SELECT * FROM MinecraftDB.items;';
    result = db.query(sql);
    result.then(function(rows){
        console.log(rows);
        res.send(rows);
    });
});

app.get("/delete",function(req,res){
    var id = req.param('id');
    var sql = 'UPDATE MinecraftDB.items SET amount = amount - 1 WHERE itemID=' + id + ' AND amount > 0;';
    console.log(sql);
    result = db.query(sql);
    result.then(function(rows){
        console.log(rows);
        res.send(rows);
    });
});

app.get("/click", function(req, res){
    var id = req.param('id');
    var sql = 'UPDATE MinecraftDB.items SET amount = amount + 1 WHERE itemID =' + id + ";";
    result = db.query(sql);
    result.then(function(rows){
        console.log(rows);
        res.send(rows);
    });
});

app.get("/login/:username/:password", function(req, res){
    var user = req.param('username');
    var pass = req.param('password');
    var sql = 'SELECT * FROM MinecraftDB.users WHERE name = "' + user + '" && password = "' + pass + '"';
    var result = db.query(sql);
    result.then(function(rows){
        res.send(rows);
    });
});

app.get("/void", function(req, res){
    var sql = 'UPDATE items SET amount = 0';
    var result = db.query(sql);
    result.then(function(rows){
        res.send(true);
    });
});

app.get("/sale/:start/:end/:id", function(req, res){
    var sql = 'INSERT INTO archive (start, end, userId) VALUES (\'' + req.param("start") +'\',\'' + req.param("end") + '\',' + req.param("id") +')';
    console.log(sql);
    var result = db.query(sql);
    result.then(function(rows){
        var tid = rows.insertId;
        var sql = "INSERT INTO transaction (itemID, amount, unitPrice, tId) SELECT itemID, amount, price as unitPrice, " + tid + " as tId FROM items WHERE amount > 0;";
        var result = db.query(sql);
        result.then(function (rows){
            var sql = 'UPDATE items SET amount = 0';
            var result = db.query(sql);
            result.then(function(rows) {
                res.send(rows);
            });
        });
    });
});

app.listen(port);
