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

  Object.defineProperty(user.prototype, 'imageSRC', {get: function(){
    if(this.avatar) {
      return S3 + this.avatar;
    }
  }})
  return user;
}