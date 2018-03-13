# Support 

We support the following methods to get API:

router.get('/', function (req, res, next)
router.get('/:id', function (req, res, next)
router.post('/get-one', function (req, res, next)
router.post('/', middleware.authenticate, middleware.elevate, function (req, res, next)
router.put('/', middleware.authenticate, middleware.elevate, function (req, res, next)
router.delete('/:id', middleware.authenticate, middleware.elevate, function (req, res, next)
router.put('/update-one', middleware.authenticate, middleware.elevate, function (req, res, next)

# Tables Supported

We support the following tables: 

services.push(require('users'));
services.push(require('events'));
services.push(require('teams'));
services.push(require('accomm'));
services.push(require('bodies'));
services.push(require('scores/leaderboard'));
services.push(require('scores/feed'));
services.push(require('news'));


The requests that you make become of this format: 
	GET /api/events
    GET /api/events/599b79eb351ac678c632257a
    POST /api/scores/leaderboard


# Etiquettes

All POST and PUT requests need some data in their body. GET requests don't have a body.
As can be seen from the lines of code, all GET requests in our API can be made without
authentication. However, to make POST and other requests you need to be authenticated.

Note: It really would help to see the database schema for each table. In each file, you get an
object named schema. That contains the info you need.
https://github.com/crux-bphc/fest-manager/tree/arena/routes/api/services

Example schema: https://github.com/crux-bphc/fest-manager/blob/arena/routes/api/services/feed.js#L8
Here, you can see that you have to specify a sport and a text for the database to accept data.

# Features 

--> WE HAVE PAGINATION ON "GET" REQUESTS

Pagination is the splitting of results into various pages. It is very helpful in cases when there are too many results. We provide 10 pages per result. To the GET requests specified above, add
?page=<pagenumber> to get paginated results.

GET /api/users?page=2 would return the following:

{
  "docs": [{array}, {of}, {user}, {objects}],
  "total": 52,
  "limit": 10,
  "page": "2",
  "pages": 6
}

This would differ from the usual GET without pagination which directly returns:

[{array}, {of}, {user}, {objects}]


--> WE HAVE SORTING ON "GET" REQUESTS 


We can sort data by almost all fields that have a concept of greater than or less than. This
means that we can sort by numeric fields as well as string fields.

Example:

GET /api/events?sort=name will sort them by name.
GET /api/events?sort=prize will sort by prize money.

Note: You CANNOT combine sorting and pagination because of how hacky it has been till
now to paginate stuff properly. Update Coming Soon.


# Example Requests: 

To see the list of all users (don't do this on prod server, too many users)

GET /api/users

Returns: Array of users.
[
  {
    "_id": "59f25a7317295b51d66f7c2a",
    "updatedAt": "2017-10-26T21:58:11.102Z",
    "createdAt": "2017-10-26T21:58:11.102Z",
    "email": "aero31aero@gmail.com1",
    "__v": 0,
    "notifications": [],
    "pending": [],
    "isAmbassador": false,
    "events": [],
    "teams": []
  },
  {
    "_id": "59f25a9bd711a5534ded9a1f",
    "updatedAt": "2017-10-26T21:58:51.949Z",
    "createdAt": "2017-10-26T21:58:51.918Z",
    "email": "aero31aero@gmail.com2",
    "__v": 0,
    "notifications": [],
    "pending": [],
    "isAmbassador": false,
    "events": [
      "59e77b397a05df242c7a3231"
    ],
    "teams": [
      "CQYM8KW"
    ]
  }
  {
    "_id": "59e77b397a05df242c7a322c",
    "updatedAt": "2018-01-14T20:23:31.684Z",
    "createdAt": "2017-10-18T16:03:05.484Z",
    "__v": 0,
    "email": "aero31aero@gmail.com",
    "privilege": {
      "level": 2
    }
]