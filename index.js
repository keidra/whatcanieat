var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var User = require('./models/user');
var path = require('path');
var app = express();

var secret = "mysupersecretpassword";

var mongodbURI = process.env.MONGODB_URI || 'mongodb://localhost/products';
mongoose.Promise = global.Promise;
mongoose.connect(mongodbURI);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/product', expressJWT({secret: secret}));
app.use('/api/users', expressJWT({secret: secret})
.unless({path: ['/api/users'], method: 'post'}));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({message: 'You need an authorization token to view this information.'})
  }
});

app.use('/api/products', require('./controllers/products'));
app.use('/api/users', require('./controllers/users'));

app.post('/api/auth', function(req, res) {
  console.log("logging in", req.body.email);
  User.findOne({email: req.body.email}, function(err, user) {
    console.log(err);
    console.log(user)
    if (err || !user) return res.status(401).send({message: 'User not found'});
    user.authenticated(req.body.password, function(err, result) {
      console.log(err)
      console.log(result)
      if (err || !result) return res.status(401).send({message: 'User not authenticated'});
      console.log("user authenticated");
      var token = jwt.sign(user, secret);
      res.send({user: user, token: token});
    });
  });
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT || 3000);