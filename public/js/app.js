angular
  .module('user-app', ['ngResource', 'angular-jwt', 'ui.router', 'ngFileUpload'])
  .constant('API', 'http://localhost:3000/api')
  .constant('S3', 'https://s3-eu-west-1.amazonaws.com/wdi-london18/')
  .config(InterceptorConfig)
  .config(Router)
  

InterceptorConfig.$inject = ['$httpProvider'];

function InterceptorConfig($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }


Router.$inject = ['$stateProvider', '$urlRouterProvider'];
function Router($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/', 
      templateUrl: 'partials/home.ejs'
    })
    .state('login', {
      url: '/login', 
      templateUrl: 'partials/login.ejs'
    })
    .state('register', {
      url: '/register', 
      templateUrl: 'partials/register.ejs'
    })
    .state('profile', {
      url: '/profile', 
      templateUrl: 'partials/profile.ejs'
    })
    .state('edit', {
      url: '/edit', 
      templateUrl: 'partials/edit.ejs'
    })
    .state('friends', {
      url: '/friends', 
      templateUrl: 'partials/friends.ejs'
    })

    $urlRouterProvider.otherwise('/login')
}      


angular
  .module('user-app')
  .factory('User', User);

User.$inject = ['$resource', 'API', 'S3'];
function User($resource, API, S3) {
  var user =  $resource(API + '/users/:id', { id: '@_id' }, {
    update: { method: "PUT" }, 
    connect: { method: "PATCH"},
    login: { method: "POST", url: API + '/login'},
    register: { method: "POST", url: API + '/register'}
  });

//make avatar string into url
  Object.defineProperty(user.prototype, 'imageSRC', {get: function(){
    if(this.avatar) {
      return S3 + this.avatar;
    }
    else {
      return "../src/images/default.png"
    }
  }})
  
  return user;
}
angular.module('user-app')
  .factory('AuthInterceptor', AuthInterceptor);


AuthInterceptor.$inject = ['API', 'tokenService', 'roleService'];


function AuthInterceptor(API, tokenService, roleService) {
  return {
    request: function(config) {
      var token = tokenService.getToken();

      if(!!config.url.match(API) && !!token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    response: function(res) {
      if (!!res.config.url.match(API) && !!res.data.token) {
        tokenService.saveToken(res.data.token);
        roleService.saveRole(res.data.user.role)
      }
      return res;
    }
  }
} 
angular.module('user-app')
  .service('roleService', roleService);

roleService.$inject = ['$window', 'jwtHelper'];
function roleService($window, jwtHelper) {
  var self = this;


  self.saveRole = function(role) {
    $window.localStorage.setItem('role', role);

  }

  self.getRole = function() {
    return $window.localStorage.getItem('role');
  }

  self.removeRole = function () {
    return $window.localStorage.removeItem('role');
  }

}  
angular.module('user-app')
  .service('tokenService', TokenService);

TokenService.$inject = ['$window', 'jwtHelper'];
function TokenService($window, jwtHelper) {
  var self = this;


  self.saveToken = function(token) {
    $window.localStorage.setItem('token', token);

  }

  self.getToken = function() {
    return $window.localStorage.getItem('token');
  }

  self.removeToken = function () {
    return $window.localStorage.removeItem('token');
  }

  self.getUser = function () {
    var token = self.getToken();
    return token? jwtHelper.decodeToken(token) : null;
  }
}  
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