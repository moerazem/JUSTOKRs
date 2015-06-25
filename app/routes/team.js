import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function(params) {
      return Ember.RSVP.hash({
        team:    this.store.find('team', params.teamId),
        quarter: this.store.find('quarter', params.quarterId)
      });
    },
    controllerName: 'team',
    setupController: function(controller, models) {
      this._super(controller,models);
      controller.set('quarter', models.quarter);
      controller.set('content', models.team);
    },
    actions: {
      archiveTeam: function() {
        var controller = this.controller,
            self       = this,
            quarter    = this.get('session.current_quarter');
        // get deliverables from team
        controller.get('deliverables').then(function(deliverables){
          // destroy deliverables for the team
          deliverables = deliverables.toArray();
          deliverables.forEach(function(deliverable){
            deliverable.destroyRecord();
          });
          // destroy team
          controller.get('model').destroyRecord().then(function() {
            controller.transitionToRoute('teams', self.get('session.organisation'), quarter);
          });
        });
      }
    }
  }
);
