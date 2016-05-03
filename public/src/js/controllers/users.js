angular
  .module('user-app')
  .controller('usersController', UsersController)

UsersController.$inject = ['User', 'tokenService', 'Upload', 'API', 'S3', 'roleService', '$state']
function UsersController(User, tokenService, Upload, API, S3, roleService, $state) {
  var self = this;

  self.all = [];
  self.currentUser = tokenService.getUser();
  self.currentRole = roleService.getRole();
  self.newUser = {};
  self.query = {};

  function handleLogin(res) {
    var token = res.token ? res.token : null;
    
    // Console.log our response from the API
    if(token) {
      console.log(res);
      self.getUsers();
      self.currentUser = tokenService.getUser();
    }
    $state.go('home')
    self.message = res.message;
  }

  self.login = function() {
    User.login(self.currentUser, handleLogin);
  }

  self.register = function() {
    Upload.upload({
      url: API + '/register',
      data: self.newUser
    }).then(function(res) {
      handleLogin(res);
      $state.go('home')
    });
    

  }

  self.logout = function() {
    tokenService.removeToken();
    roleService.removeRole();
    self.all = [];
    self.currentUser = null
    self.message = "";
  }

  self.check = function() {
    console.log("working really");
  }
  self.getUsers = function() {
    self.all = User.query();
  }

  self.isLoggedIn = function() {
    return !!tokenService.getToken();
  }

  if(self.isLoggedIn()) self.getUsers();

  

  return self;
}