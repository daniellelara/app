USER APP

Using Jwt and bcryp, created an authenticated app in nodeJs with a back-end API and AngularJS in the front-end. There are three user roles:
1.normal
2.admin
3.super

There is on super user that can add admins. Admins can see conections between other users. All users can add/delete connections. Users can upload a profile image.


Instructions for deployment:

- npm install
- bower install
You will need to set the following environment variables:
AWS_BUCKET_NAME, AWS_SECRET_KEY, AWS_ACCESS_KEY
- node run
