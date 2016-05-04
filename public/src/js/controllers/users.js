angular
  .module('user-app')
  .controller('usersController', UsersController)

UsersController.$inject = ['User', 'tokenService', 'Upload', 'API', 'S3', 'roleService', '$state', '$http', '$scope']
function UsersController(User, tokenService, Upload, API, S3, roleService, $state, $http, $scope) {
  var self = this;

  self.all = [];
  self.currentUser = tokenService.getUser();
  self.currentRole = roleService.getRole();
  self.user = {};

  

  function handleLogin(res) {
    var token = res.token ? res.token : null;
    if(token) {
      console.log(res);
      self.getUsers();
      self.currentUser = tokenService.getUser();
      

    }
    self.getUser();
    console.log("on longin", self.user)
    $state.go('home')
    self.message = res.message;
  }

  self.login = function() {
    User.login(self.currentUser, handleLogin);
  }

  self.register = function() {
    Upload.upload({
      url: API + '/register',
      data: self.currentUser
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
    $state.go('login')
  }

  
  self.getUsers = function() {
    self.all = User.query();
  }
  self.addConnection = function(id) {
    User.connect({id: self.currentUser._id}, {friends: id});
    self.getUsers();
    self.getUser();
  }

  self.deleteConnection = function(id) {
    $http
      .patch(API +'/users/' + self.currentUser._id + '/disconnect', {friends: id})
      .then(function(res) {
      self.getUser();
      self.getUser();
    })

      var index = self.user.friends.indexOf(id);
      self.user.friends.splice(index, 1);
  }

  self.getUser = function() {
    self.userData = User.get({id: self.currentUser._id});
    console.log(self.user);
    self.userData.$promise.then(function(data) {
      $scope.$applyAsync(function(){
           self.user = data;
          console.log(data);
            });
    });
    console.log(self.user, "whey?")
  }
  
  


  self.isLoggedIn = function() {
    return !!tokenService.getToken();
  }
  
  
  if(self.isLoggedIn()) self.getUsers();

  return self;
}