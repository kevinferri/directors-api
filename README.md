# Directors API

## To use/clone this app
```
git clone http://github.com/kevinferri/directors-api
cd directors-api
npm install
node server.js
```

App will be running on `http://localhost:3000`

## Software Requirements
* [Node](https://nodejs.org/)
* [MongoDB](https://www.mongodb.org/)

## Route definitions

| HTTP verb | Route                      | Description                                                                   |
| --------- | -------------------------  | ----------------------------------------------------------------------------- |
| POST      | /directors                 | Creates individual director document based on `livestream_id` in request body |
| GET       | /directors                 | Gets a list of all the directors                                              |
| GET       | /directors/{director_id}   | Gets individual director document                                             |
| PUT       | /directors/{director_id}   | Updates either `favorite_camera` or `favorites_movies` based on request body  |

## Tests