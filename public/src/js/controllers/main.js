angular
  .module('user-app')
  .controller('mainController', MainController)

MainController.$inject = ['User', 'tokenService', 'Upload', 'API', 'S3', 'roleService', '$state', '$http', '$scope']

function MainController(User, tokenService, Upload, API, S3, roleService, $state, $http, $scope) {
  var self = this;
  self.user = {};
  self.currentUser = tokenService.getUser();
  
  self.addConnection = function(id) {
    User.connect({id: self.currentUser._id}, {friends: id});
    self.getUsers();
  }

  self.deleteConnection = function(id) {
    $http
      .patch(API +'/users/' + self.currentUser._id + '/disconnect', {friends: id})
      .then(function(res) {
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
           self.user = data.user;
           console.log(data.user._id);
            });
    });
    console.log(self.user.friends)
  }
  
  self.getUser();
  

}  