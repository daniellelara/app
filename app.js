var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = require('./config/routes');
var config = require('./config/app');

app.set("view engine", "ejs");
app.set("views", __dirname + "/public");
app.use(express.static(__dirname + '/public'));

mongoose.connect(config.databaseUrl);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', router);
app.get('/', function(req, res) {
  res.render('index');
});
app.listen(config.port, function() {
  console.log("Express is listening on port " + config.port);
});