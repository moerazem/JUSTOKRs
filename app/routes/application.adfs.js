import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(
  ApplicationRouteMixin,
  { 
    actions: {
      sessionAuthenticationSucceeded: function() {
        var self = this;
        self.transitionTo('summary', self.get('session.organisation'), self.get('session.current_quarter')); 
        // if there's a new version update show it to the user
        if (self.get('session.version_update')) {
          self.notify.info({ raw:        self.get('session.version_update') + '<br><br>You can see these notes in full at the bottom of the Help section.',
                             closeAfter: 60000 }); // close after a minute
        }
      },
      sessionAuthenticationFailed: function() {
        this.notify.alert('Invalid credentials - Please try to login again.');
        this.transitionTo('login');
      },
      error: function(error) {
        var self = this;
        if (error.status === 401) { // the token didnt authenticate, perhaps due to someone else logging into the account or timeout
          this.transitionTo('accountTimedOut').then(function() { 
            setTimeout(function() {
              self.get('session').invalidate();
            }, 3000);
          });
        } else {
          console.log(error);
          this.transitionTo('recordNotFound');
        }
      }
    }
  }
);
