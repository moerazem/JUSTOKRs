# Okr

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* Set up the following environment variables (e.g. in your .bash_profile)
  export OKR_HOME="/Users/user.name" NB. it's assumed that the OKR source code will sit in a folder called /src/okr under this path
  export OKR_EMBER="https://localhost:4200" - the URL of the Ember server
  export OKR_EMBER="http://localhost:3000" - the URL of the Node server
  export OKR_DB_HOST="localhost"
  export OKR_DB_DB="okr"
  export OKR_DB_USER="okr"
  export OKR_DB_PASS="somethingHardToGuess"
  export OKR_AD_REDIRECT=Full URL to redirect to after login
  export OKR_JIRA=URL to your JIRA install (if you have one)
* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

