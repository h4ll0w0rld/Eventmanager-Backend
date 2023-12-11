## Getting Started
The following instructions will guide you to run this project on your computer

## Build with
Node v19.7.0

## Installation
1. Install the node_modules:
```shell
npm install
```

2. Create a .env file in the root directory and add the following variables:
```shell
ACCESS_TOKEN_SECRET={your Token}
REFRESH_TOKEN_SECRET={your Token}
```

to generate a Token you can use this in your console:

```shell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

generate a Token for the ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET

## Start the App
Type the following command to run nodemon and the ExpressServer
```shell
npm start
```


## Database

### Database information

The database config informations are set in the ./config/config.js file.

### Database configuration

The databse setup is made in `./src/models/index.js`

The schema files are in `./src/models/sequelize_models/*`


## API-routes
all Routes are configured in `./routes/routes.js`

## controller
every interaction with the requests are handled in the controllers `./controller/*`


# Dokumentation
 
The full API-Dokumentation could be fould here: 
https://documenter.getpostman.com/view/26686947/2s93z894E6