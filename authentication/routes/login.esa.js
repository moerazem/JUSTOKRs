import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    var self = this;
    if (this.get('session.access_token')) { // if user is already logged in then redirect them to summary page
      self.transitionTo('summary', self.get('session.organisation'), self.get('session.current_quarter')); 
    } else {
      this.render('login');
    }
  }
});
