angular
  .module('user-app')
  .controller('usersController', UsersController)

UsersController.$inject = ['User', 'tokenService', 'Upload', 'API', 'S3', 'roleService', '$state', '$http', '$scope']
function UsersController(User, tokenService, Upload, API, S3, roleService, $state, $http, $scope) {
  var self = this;

  self.all = [];
  self.currentUser = tokenService.getUser();
  self.currentRole = roleService.getRole();
  self.user = null;
  



//on loign and register
  function handleLogin(res) {
    var token = res.token ? res.token : null;
    if(token) {
      self.getUsers();
      self.currentUser = tokenService.getUser(); 
      self.currentRole = roleService.getRole();    
    }
    self.getUser();
    $state.go('home')
    self.message = res.message;
  }

//authentication
  self.login = function() {
    User.login(self.currentUser, handleLogin);
  }

//register new user
self.register = function () {
 User.register(self.currentUser, handleLogin);
  $state.go('home')
   
  }

//on logout remove token, role, reset variable and return to login page
  self.logout = function() {
    tokenService.removeToken();
    roleService.removeRole();
    self.all = [];
    self.currentUser = null
    self.user = null;
    $state.go('login')
  }

//get all users query  
  self.getUsers = function() {
    self.all = User.query();
    self.getUser();
  }

//is the user already connected with current user
  self.alreadyConnected = function(friend) {
    if(self.user){
      var array = self.user.friends;
      var id = friend.username;
      console.log("who", friend.username);
      for(var i=0;i<array.length;i++) {
        console.log(array[i].username);
          return (array[i].username === id)
      }
    return false;
    }
}


//add connection and re get users and current user  
  self.addConnection = function(id) {
    User.connect({id: self.currentUser._id}, {friends: id});
    self.getUsers();
    self.getUser();
  }

//delete users and re get users and current user  
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

//get single user
  self.getUser = function() {
    self.userData = User.get({id: self.currentUser._id});
        self.userData.$promise.then(function(data) {
          $scope.$applyAsync(function(){
               self.user = data;
          });
        });
        console.log(self.user, "whey?")
  }
console.log('two', self.user);
//edit user account
  self.editUser = function(user) {
    Upload.upload({
      url: API + '/users/'+ self.currentUser._id,
      data: user,
      method: 'PUT'
      }).then(function(res){
        self.getUser();
        console.log("it worked", res);
      })
  }

//does this user have connections
 self.hasConnections = function(friends) {
  console.log("howmany", friends);
  if (friends.length > 0) {
    return true;
  }
  else {
    return false;
  }
 }  

//check if admin only
self.showFriends = function() {
  console.log("role", self.currentRole)
   if (self.currentRole === 'admin') {
     return true
   }
   else {
    return false;
   }
 }

//for admin only
 self.showConnections= function(friends) {
  self.friends = friends;
  $state.go('friends');
 }

//check if super user to choose admin
  self.isInCharge = function() {
    if (self.currentRole === 'super') {
      return true
    }
    else {
     return false;
    }
  }
//make user an admin
  self.makeAdmin = function(userId) {
    console.log(userId);
    var user = {
      role: "admin"
    }
    User.update({id: userId}, user, function() {
      self.getUsers();
    });
  }

 //logged in state  
  self.isLoggedIn = function() {
    return !!tokenService.getToken();
  }
  
  if(self.isLoggedIn()) self.getUsers(); 

  return self;
}