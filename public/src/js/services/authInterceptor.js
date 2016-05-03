angular.module('user-app')
  .factory('AuthInterceptor', AuthInterceptor);


AuthInterceptor.$inject = ['API', 'tokenService'];


function AuthInterceptor(API, tokenService) {
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
      }
      return res;
    }
  }
} 