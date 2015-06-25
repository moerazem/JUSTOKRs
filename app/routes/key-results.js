import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function() {
      var quarterId = parseInt(this.modelFor('quarter').id);
      // set the quarter so it can be passed in the API call header for objectives
      this.set('session.quarter', quarterId);
      return this.store.find('keyResult', {organisation: this.get('session.organisation'), quarter: quarterId, committed: 1});
    }
  }
);
