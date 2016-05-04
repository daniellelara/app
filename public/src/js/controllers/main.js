angular
  .module('user-app')
  .controller('mainController', MainController)

MainController.$inject = ['User', 'tokenService', 'Upload', 'API', 'S3', 'roleService', '$state', '$http', '$scope']

function MainController(User, tokenService, Upload, API, S3, roleService, $state, $http, $scope) {
  var self = this;
  
  self.current = tokenService.getUser();

  

}  