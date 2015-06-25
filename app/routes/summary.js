import Ember from 'ember';

export default Ember.Route.extend({
 redirect: function() {
   this.transitionTo('keyResults', this.get('session.organisation'), this.get('session.current_quarter')); 
 }
});
