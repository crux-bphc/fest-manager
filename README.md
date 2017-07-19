# Fest Manager
[![Build Status](https://travis-ci.org/CRUx-BPHC/fest-manager.svg?branch=master)](https://travis-ci.org/CRUx-BPHC/fest-manager)
[![Coverage Status](https://coveralls.io/repos/github/CRUx-BPHC/fest-manager/badge.svg?branch=master)](https://coveralls.io/github/CRUx-BPHC/fest-manager?branch=master)
Fest Manager is a Single Page Express Application that can be used to easily deploy websites for college fests.

## Installation

This app depends on:

1. MongoDB version 2.6 or higher
2. NodeJS version 6.10 or higher

Install them in the recommended way for your operating system. If your distribution's package repositories are updated, it should be as trivial as `sudo apt install nodejs mongodb`. A few pointers could be:

- https://nodejs.org/en/download/package-manager/
- https://docs.mongodb.com/manual/administration/install-community/

To get the app up and running, do the following:
1. Clone the repository using `git clone https://github.com/CRUx-BPHC/fest-manager.git`.
2. Change directory and install dependencies with `cd fest-manager; npm install`.
3. Create the config file (`/config.js`) like following:

**Note**: Developers can skip this step and instead use the `dev-config.js` by default.

```js
var config = {
    facebook: {
        clientID: '{your variables here}',
        clientSecret: '{your variables here}',
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['emails']
    },
    google: {
        clientID: '{your variables here}',
        clientSecret: '{your variables here}',
        callbackURL: "http://localhost:3000/auth/google/callback",
        profileFields: ['emails']
    },
    github: {
        clientID: '{your variables here}',
        clientSecret: '{your variables here}',
        callbackURL: "http://localhost:3000/auth/github/callback",
        profileFields: ['emails']
    }
}
module.exports = config;
```

4. Ensure MongoDB is running. Depending on your OS, you might need to run MongoDB using `mongod --dbpath <path_to_data_dir>`.
5. Run the project with `npm start`. Visit <localhost:3000> to view.

**Note**: Developers should instead use `npm run dev` to run using [nodemon](https://www.npmjs.com/package/nodemon).

## Contributing

We love contributions and would be glad to help you make good patches. That out of the way, an average
contribution would involve the following:

1. Fork this repository in your account.
2. Clone it on your local machine.
3. Add a new remote using `git remote add upstream https://github.com/CRUx-BPHC/fest-manager.git`.
4. Create a new feature branch with `git checkout -b my-feature`.
5. Make your changes.
6. Lint your files and run all tests locally using `grunt` and `grunt test`.
7. Commit your changes.
8. Rebase your commits with `upstream/master`:
  - `git checkout master`
  - `git fetch upstream master`
  - `git reset --hard FETCH_HEAD`
  - `git checkout my-feature`
  - `git rebase master`
9. Resolve any merge conflicts, and then push the branch with `git push origin my-feature`.
10. Create a Pull Request detailing the changes you made and wait for review/merge.

It might seem a little complicated at a glance, but the fundamental concept is simple: we
want to ensure that your changes are always made on top of the latest changes to the
project and thus, we can easily merge your code. If you are facing any troubles, create a
PR as you usually would and we would merge it manually. :)

### Commit Message Guidelines

The commit message:

- is written in the imperative (e.g., "Fix ...", "Add ...")
- is kept short, while concisely explaining what the commit does.
- is clear about what part of the code is affected -- often by prefixing with the name of the subsystem and a colon, like "express: ..." or "docs: ...".
- is a complete sentence, ending with a period.

Good summaries:

- `scripts: Fix running stream_data and node tests individually.`
- `gather_subscriptions: Fix exception handling bad input.`
- `Add GitLab integration.`

Compare `gather_subscriptions: Fix exception handling bad input.` with:

- `gather_subscriptions was broken`, which doesn't explain how it was broken (and isn't in the imperative)
- `Fix exception when given bad input`, in which it's impossible to tell from the summary what part of the code is affected
- `gather_subscriptions: Fixing exception when given bad input.`, not in the imperative
- `gather_subscriptions: Fixed exception when given bad input.`, not in the imperative

## License

This software is released under the MIT License.

```
Copyright 2017 Crux

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
