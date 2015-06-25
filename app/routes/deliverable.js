import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function(params) {
      return Ember.RSVP.hash({
        deliverable: this.store.find('deliverable', params.deliverableId), 
        teams:       this.store.find('team', {organisation: this.get('session.organisation'), quarter: this.get('session.current_quarter')})
      });
    },
    controllerName: 'deliverable', 
    setupController: function(controller, model) {
      this._super(controller,model);
      controller.set('model', model.deliverable);
      controller.set('teamList', model.teams);
      controller.set('krList', this.store.find('keyResult', {quarter: this.get('session.current_quarter'), objective: this.get('objective.id')}));
    },
    renderTemplate: function() {
      this.render('deliverable');
    },
    actions: {
      archiveDeliverable: function() {
        var controller = this.controller,
            self       = this,
            quarter    = controller.get('model.keyResult.quarter.id'),
            kr         = controller.get('model.keyResult.id');

        // get deliverableUpdates from deliverable
        controller.get('deliverableUpdates').then(function(deliverableUpdates){
          // destroy deliverableUpdates for the d
          deliverableUpdates = deliverableUpdates.toArray();
          deliverableUpdates.forEach(function(deliverableUpdate){
            deliverableUpdate.destroyRecord();
          });

          // destroy d
          controller.get('model').destroyRecord().then(function() {
            controller.transitionToRoute('keyResult', self.get('session.organisation'), quarter, kr);
          });
        }); 
      }
    }
  }
);
