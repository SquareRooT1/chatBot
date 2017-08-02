#Heroku
This application use heroku node-js-getting-started project. If you don't know anything about Heroku please check
https://github.com/heroku/node-js-getting-started.

# node-js-getting-started
This application supports the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/SquareRooT1/SimpleFacebookChatBot.git # or clone your own fork
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Configuration
Then open [facebook messanger-platform Documentation](https://developers.facebook.com/docs/messenger-platform/) and start with getting started . Create an application get your VERIFY_TOKEN and ACCESS_TOKEN then change  VERIFY_TOKEN and ACCESS_TOKEN in here.
```
if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === <VERIFY_TOKEN>)
    
  qs: { access_token: <ACCESS_TOKEN> }
```      

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
