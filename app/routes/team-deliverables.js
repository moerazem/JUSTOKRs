import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,  
  {
    model: function() {
      var teamId    = this.modelFor('team').team.get('id');
      var quarterId = this.modelFor('team').quarter.get('id');
      // set the quarter so it can be passed in the API call header for objectives
      this.set('session.quarter', quarterId);
      return this.store.find('deliverable', {team: teamId, quarter: quarterId});
    }
  }
);
