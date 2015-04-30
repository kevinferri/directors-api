# Directors API

## To use/clone this app
```
git clone http://github.com/kevinferri/directors-api
cd directors-api
npm install
node server.js
```

App will be running on `http://localhost:3000`

## Route definitions

| HTTP verb | Route                      | Description                                                                   |
| --------- | -------------------------  | ----------------------------------------------------------------------------- |
| POST      | /directors                 | Creates individual director document based on `livestream_id` in request body |
| GET       | /directors                 | Gets a list of all the directors                                              |
| GET       | /directors/{director_id}   | Gets individual director document                                             |
| PUT       | /directors/{director_id}   | Updates either `favorite_camera` or `favorites_movies` based on request body. Can accept an array or a string seperated by commas  |

## Tests

This API uses mocha for testing. All tests can be found in the `/test` folder. To run tests:

```
$ mocha
```