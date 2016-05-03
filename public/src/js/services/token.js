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