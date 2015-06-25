import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function(params) {
      return this.store.find('keyResult', params.krId);
    },
    afterModel: function(model) {
      model.get('deliverables').forEach(function(item) {
        if (item.get('isLoaded')) { // don't reload items that are still loading
          item.reload();
        }
      });
    },
    actions: {
      archiveKeyResult: function() {
        var controller = this.controller;
        var quarter    = controller.get('model.quarter.id');
        var self       = this;
        // get keyResultUpdates from keyResult
        controller.get('keyResultUpdates').then(function(keyResultUpdates){
          // destroy keyResultUpdates for the kr
          keyResultUpdates = keyResultUpdates.toArray();
          keyResultUpdates.forEach(function(keyResultUpdate){
            keyResultUpdate.destroyRecord();
          });
          // get deliverables from keyResult
          controller.get('deliverables').then(function(deliverables){
            // destroy deliverables for the kr
            deliverables = deliverables.toArray();
            deliverables.forEach(function(deliverable){
              // get deliverableUpdates from deliverable
              deliverable.get('deliverableUpdates').then(function(deliverableUpdates){
                // destroy deliverableUpdates for the deliverable
                deliverableUpdates = deliverableUpdates.toArray();
                deliverableUpdates.forEach(function(deliverableUpdate){
                  deliverableUpdate.destroyRecord();
                });
                deliverable.destroyRecord();
              });
            });
          });
        });
        controller.get('model').destroyRecord().then(function() {
          controller.transitionToRoute('keyResults', self.get('session.organisation'), quarter);
        });
      }
    }
  }
);
