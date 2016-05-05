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

    $urlRouterProvider.otherwise('/')
}      

