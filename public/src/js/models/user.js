angular
  .module('user-app')
  .factory('User', User);

User.$inject = ['$resource', 'API'];
function User($resource, API) {
  return $resource(API + '/users/:id', { id: '@_id' }, {
    update: { method: "PUT" }, 
    connect: { method: "PATCH"},
    login: { method: "POST", url: API + '/login'},
    register: { method: "POST", url: API + '/register'}
  });
}