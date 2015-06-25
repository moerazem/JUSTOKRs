import Ember from 'ember';

export default Ember.Route.extend({
 redirect: function() {
   if (this.get('session.isAuthenticated')) {
     this.transitionTo('summary', this.get('session.organisation'), this.get('session.current_quarter'));
   } else {
     this.transitionTo('login');
   }
 }
});
