# Directors API

## To use/clone this app
Have mongoDB installed and running then run
```
git clone http://github.com/kevinferri/directors-api
cd directors-api
npm install
node server.js
```

App will be running on `http://localhost:3000`

## Description
A director must have a valid Livestream id in order to create an account on this API. After a director account is created, they can edit their favorite camera and favorite movies but nothing else. Anyone can see a list of every director that has registered and also see any individual director's information. Directors can remove their account as well.

## Dependencies

* [Express](https://www.npmjs.com/package/express)
* [Mongoose](https://www.npmjs.com/package/mongoose)
* [Body-parser](https://www.npmjs.com/package/body-parser)
* [Request](https://www.npmjs.com/package/request)

## Route definitions

| HTTP verb    | Route              | Description                                                                   |
| ------------ | -----------------  | ----------------------------------------------------------------------------- |
| POST         | /directors         | Creates individual director document based on `livestream_id` in request body |
| GET          | /directors         | Gets a list of all the directors                                              |
| GET          | /directors/{_id}   | Gets individual director document                                             |
| DELETE       | /directors/{_id}   | Removes individual director document                                          |
| PUT          | /directors/{_id}   | Updates either `favorite_camera` or `favorites_movies` based on request body. Can accept an array or a string seperated by commas and a space e.g. "Movie1, Movie2, Movie3"  |

## File definitions

```
config/         -> config information
resources/      -> handles http requests to a specific resource, file named after the resource it controls
lib/            -> application specific libraries
models/         -> database schema
test/           -> mocha test files
routes.js       -> defines the routes of the API
server.js       -> main file
```

## Tests

This API uses [Mocha](http://mochajs.org/) for testing. All tests can be found in the `/test` folder. Once the dependencies are installed go into the root level of the app and run

```
mocha
```