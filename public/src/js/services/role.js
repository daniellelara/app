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