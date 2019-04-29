var express=require('express'),
    mysql=require('mysql'),
    credentials=require('./credentials.json'),
    app = express(),
    port = process.env.PORT || 1337,
    db = require('./database.js');


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res, next) {
    // Handle the get for this route
});

app.post('/', function(req, res, next) {
    // Handle the post for this route
});



app.use(express.static(__dirname + '/public'));
app.get("/items",function(req,res){
    var sql = 'SELECT * FROM busy_team.Table_Order;';
    result = db.query(sql);
    result.then(function(rows){
        console.log(rows);
        res.send(rows);
    });
});

app.get("/delete",function(req,res){
    var id = req.param('id');
    var sql = 'UPDATE busy_team.Table_Order SET amount = amount - 1 WHERE Order_ID=' + id + ' AND amount > 0;';
    console.log(sql);
    result = db.query(sql);
    result.then(function(rows){
        console.log(rows);
        res.send(rows);
    });
});

app.get("/click", function(req, res){
    var id = req.param('id');
    var sql = 'UPDATE busy_team.Table_Order SET amount = amount + 1 WHERE Order_ID =' + id + ";";
    result = db.query(sql);
    result.then(function(rows){
        console.log(rows);
        res.send(rows);
    });
});

app.get("/login/:username/:password", function(req, res){
    var user = req.param('username');
    var pass = req.param('password');
    var sql = 'SELECT * FROM busy_team.login WHERE user_ID = "' + user + '" && use_PSWD = "' + pass + '"';
    var result = db.query(sql);
    result.then(function(rows){
        res.send(rows);
    });
});

app.get("/void", function(req, res){
    var sql = 'UPDATE Table_Order SET amount = 0';
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
