/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'okr',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.NODE_HOST   = process.env.OKR_NODE;
  ENV.AD_REDIRECT = process.env.OKR_AD_REDIRECT;
  ENV.JIRA_HOST   = process.env.OKR_JIRA;
  ENV['simple-auth'] = {
    authorizer: 'simple-auth-authorizer:oauth2-bearer',
    store: 'simple-auth-session-store:local-storage',
    crossOriginWhitelist: ENV.NODE_HOST.split()
  };
  ENV['simple-auth-oauth2'] = {
    // serverTokenEndpoint:  'http://localhost:3000/token'
    serverTokenEndpoint:  ENV.NODE_HOST + '/adfsCheck'
  }; 
  ENV.APP.API_HOST = ENV.NODE_HOST;

  ENV['ember-can'] = {
    inject: {
      session: 'simple-auth-session:main'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.contentSecurityPolicy = {
      'default-src': "'none'",
      'connect-src': "'self' http://localhost:3000",
      'style-src': "'self' 'unsafe-inline'",
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  return ENV;
};
