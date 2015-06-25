import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function() {
      var objectiveId = this.modelFor('objective').objective.get('id');
      var quarterId   = this.modelFor('objective').quarter.get('id');
      return this.store.find('keyResult', {quarter: quarterId, objective: objectiveId});
    }
  }
);
