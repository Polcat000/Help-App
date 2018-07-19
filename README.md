[![Build Status](https://travis-ci.org/Polcat000/Help-App.svg?branch=master)](https://travis-ci.org/Polcat000/Help-App)
# Help! App

Help! is an app that displays emergency information for users that are registered in our database.

This app has been deployed to Heroku. :point_right:    [Help!](https://code-louisville-help-app.herokuapp.com/ "Giddyup!")

# Setting up


To run locally:

Help! uses Node.js as well as Express, and stores its users' information in a MongoDB database. 

First, check that you have node and npm installed.
```
    $ node -v
```

```
    $ npm -v
```

  
Then, clone the repo and cd into the new directory's location on your machine.
```
   $ git clone 
   $ cd root/Help-App
```   


Finally, install dependencies, and start the server.
```   
   $ npm install
   $ npm start
```


:warning:
In order for this app to run properly, it needs to access a mongoDB database using mlab.
It is set up to use environment variables for this, as well as a secret for authorization purposes.
So, you will need to add a .env file containing the following:


```
    DB_HOST=<ds00000.mlab.com:00000/yourdatabasename>
    DB_NAME=<yourdatabasename>
    DB_USERNAME=<yourmlabusername>
    DB_PASSWORD=<yourmlabpassword>
    SECRET=<yourmom>
```

If you're unfamiliar with mlab, just visit their docs and you should have all of the above in no time! https://docs.mlab.com/


Navigate to localhost:3000, and the app should be running in the browser. :tada:



If you need any help :wink: or if there are any issues :rage2: please don't hesitate to contact me on here, or submit an issue.

Thanks!
