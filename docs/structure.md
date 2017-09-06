# Directory Structure

This doc introduces the basic directory structure of the project. This is mainly for the reference of maintainers and should be kept updated with the latest changes. This version corresponds to September 7, 2017.

## Walkthrough

As every node project, you start reading with the `package.json`. Major sections of code have their own separate docs linked to from here.

### package.json

```
.
├── package.json
```

Our `package.json` specifies three main scripts, of which we rarely use `npm start`. We usually use `npm run dev` for developing locally and use `pm2` for running on production. This lists the start file of the project: `bin/www`.

### bin/www

```
.
├── bin
│   └── www
```

The `bin/www` file reads the input port from environment variables, or uses 3000 as default, and tries to start our main app from `app.js`. In case it fails, it gracefully exits.

### app.js

```
.
├── app.js
```

This file combines all the backend logic in one place by loading all the routers and authentication middlewares. In addition to that, we override a default function `render()` with `renderState()` which provides additional functionality for our single page app.

### routes/index.js

```
.
├── routes
│   ├── index.js
```

This route renders the skeleton structure for the website, the topbar and the sidebar. This is the route that is called everytime someone loads the website.

### /routes/api/*

```
.
├── routes
│   ├── api
│   │   ├── index.js
│   │   ├── services
│   │   │   ├── accomm.js
│   │   │   ├── bodies.js
│   │   │   ├── events.js
│   │   │   ├── teams.js
│   │   │   └── users.js
│   │   └── typeahead.js
```

The routes in the `/api` directory actually export three objects:

1. Route: The path to the route. Example: `/bodies`.
2. Model: Mongoose model object for doing database operations.
3. Router: Express router to attach to our main app.

### /routes/components/*

```
.
├── routes
│   ├── components
│   │   ├── about.js
│   │   ├── ca.js
│   │   ├── custom
│   │   │   └── pybits.js
│   │   ├── custom.js
│   │   ├── dashboard.js
│   │   ├── events.js
│   │   ├── index.js
│   │   ├── login.js
│   │   └── portals.js
```

The routes in `/components` directory all render pages to be shown to the user. These make use of the function `renderState()` as well as our state object to create customized user experiences.

### /views/*

```
.
└── views
    ├── about
    │   ├── history.jade
    │   ├── home.jade
    ├── ambassador.jade
    ├── custom
    │   └── pybits
    │       ├── home.jade
    │       ├── navigation.jade
    ├── dashboard
    │   ├── account.jade
    │   ├── cart.jade
    │   └── dashboard.jade
    ├── error.jade
    ├── events
    │   ├── event.jade
    │   └── home.jade
    ├── home.jade
    ├── index.jade
    ├── login.jade
    ├── mixins
    │   ├── field.jade
    │   ├── form.jade
    ├── portals
    │   ├── ca.jade
    │   ├── doshPortal.jade
    │   ├── home.jade
    └── wip.jade
```

These files are Jade templates rendered by the routes in `routes/components`. These are organised in logically named folders.

Error checking for syntax problems in Jade templates can be done by uncommenting the `console.log` line in `app.js`:

```js
res.render(filename, options, function (err, string) {
	// Uncomment to debug Jade Errors.
	// console.log(err, string);
	res.send({
		html: string,
		state: state,
	});
});
```

### public/static/*

```
.
├── public
│   └── static
│       ├── data
│       │   └── images
│       ├── fonts
│       ├── images
│       │   ├── back.jpg
│       │   ├── logo.svg
│       ├── lib
│       │   ├── jquery-ui-custom
│       │   └── typed.min.js
│       ├── manifest.json
│       ├── pybits
│       │   ├── home.js
│       │   └── psf-logo.png
│       ├── scripts
│       │   ├── index.js
│       ├── stylesheets
│       │   └── index.style.css
│       └── sw.js
```

The files in this directory are publically available to the user. We use a nested `/static` in front of the path so it is easier to configure nginx to cache these resources in production. These files are usually called by our Jade views.

These are organised into folders by type (eg: stylesheets, scripts, libraries, images, etc.) and by similarity in context (eg: all files related to PyBits). We try to add new external libraries to `/lib` and our own files in `/stylesheets` and `/scripts`.

### forms/*

```
.
├── forms
│   └── new-event.js
```

This directory contains some of the larger forms made using the [formMixin](form) that would needlessly increase the filesize of the route defining them. These are simple modules that export the form object used by our form pipeline.

### utils/*

```
.
├── utils
│   ├── authentication.js
│   ├── config-loader.js
│   ├── export-ambassadors.js
│   ├── export-users.js
│   ├── institutes.json
│   ├── letterhead.html
│   ├── mongoose.js
│   ├── options.js
│   ├── service.constructor.js
│   └── state.js
```

This directory contains small modules that are used by other modules throughout the project. These couldn't be classified into a major category and are, thus, placed here. Feel free to branch out some of these modules at a later date into separate directories, if needed.

### tools/*

```
.
├── tools
│   ├── destroy-and-rebuild-database
│   ├── export-ca-data
│   ├── export-user-data
│   ├── fetch-pull-request
│   ├── fetch-rebase-pull-request
│   └── live-rebase
```

This directory contains mostly standalone scripts for helping the developers. `live-rebase`, `fetch-pull-request` and `fetch-rebase-pull-request` have been covered in our [git guide](git-guide). `destroy-and-rebuild-database`, `export-ca-data` and `export-user-data` have been covered in our [mongo tools](mongo-tools) documentation.

### docs/*

```
.
├── docs
│   ├── _config.yml
│   ├── form.md
│   ├── images
│   │   ├── form.png
│   │   └── typeahead.png
│   ├── index.md
│   ├── _layouts
│   │   └── default.html
│   ├── nginx.md
│   ├── structure.md
│   └── typeahead.md
```

The docs contain this document you are reading, and other documentation. These are markdown files rendered by Jekyll with love from GitHub Pages. As a fellow developer, I must urge you to document the work you do on this project while it is fresh in your memory. Do follow the basic directory structure we have left for you. Best of luck. :smile:

### Others

```
.
├── dev-config.js
├── Gruntfile.js
├── LICENSE
├── README.md
├── tests
│   └── models
│       └── users.js
```

Most of these are obvious from the name. The tests directory, however, lacks a lot. We need to write more tests and do that soon. These tests are run using `grunt test`. However, to properly run the tests, you need to wipe your local database. This is why, to run the tests, we use `npm test` which wipes the database and then calls grunt to run the tests.