import Ember from 'ember';
import ENV from 'okr/config/environment';

export default Ember.Route.extend({
  model: function(params) {
    var self = this;
    if (!params.identification) { // step 1: user logs in in with ADFS, ADFS redirects to node and saves credentials, node redirects to this page
      window.location.replace(ENV.AD_REDIRECT);
    } else {                      // step 2: node redirects to this page with the token as a query param and formally authenticate with node
      self.get('session').authenticate('simple-auth-authenticator:oauth2-password-grant', { identification: params.identification });
    }
  }
});
