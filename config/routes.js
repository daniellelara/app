var router = require('express').Router();
var jwt = require('jsonwebtoken');
var authenticationController = require('../controllers/authentication');
var multer = require('multer');
var usersController = require('../controllers/users');
var secret = require('../config/app').secret;
var s3 = require('multer-s3');
var uuid = require('uuid');

//authorisation function
function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized' });

  var token = req.headers.authorization.replace('Bearer ', '');

  jwt.verify(token, secret, function(err, user) {
    if(!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}
//settings for s3 and image uploader
var upload = multer({
  storage: s3({
    dirname: 'uploads',
    bucket: process.env.AWS_BUCKET_NAME,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: 'eu-west-1',
    contentType: function(req, file, next) {
      next(null, file.mimetype);
    },
    filename: function(req, file, next) {
      var ext = '.' + file.originalname.split('.').splice(-1)[0];
      var filename = uuid.v1() + ext;
      next(null, filename);
    }
  })
});

router.post('/register', upload.single('avatar'), authenticationController.register);
router.post('/login', authenticationController.login);

router.route('/users')
  .get(usersController.index)

router.route('/users/:id')
  .get(usersController.show)
  .patch(usersController.connect)
  .delete(usersController.delete)
  .put(upload.single('avatar'), usersController.update)

router.route('/users/:id/disconnect')
  .patch(usersController.disconnect)

module.exports = router; 