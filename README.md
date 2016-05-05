#USER APP

This app is has been created using NodeJS, AngularJS, HTML5, CSS3 , Gulp and MongoDB.
Using Jwt and bcrypt for authentication, this app uses an API and AngularJS in the front-end. There are three user roles:
1.normal
2.admin
3.super

There is one super user that can add admins. Admins can see conections between other users. All users can add/delete connections. Users can upload a profile image.

Login in as the super user after running seeds with:

email: danielle@gmail.com
password: password

This user has the power to make current users admins.

### Installation

This app requires [Node.js](https://nodejs.org/) v4+ to run.

You will need to set the following environment variables .zshrc file:
AWS_BUCKET_NAME, AWS_SECRET_KEY, AWS_ACCESS_KEY

You need Gulp installed globally:

```sh
$ npm i -g gulp
```

```sh
$ git clone https://github.com/daniellelara/app.git
$ cd userapp
$ npm install
$ node config/seeds.js
$ cd public  
$ bower install
$ gulp replace:production
$ cd userapp
$ node app.js
```

## testing
You must install Mocha Globally:

```sh
$ npm install -g mocha
```
```sh
$ cd userapp
$ cd mocha
