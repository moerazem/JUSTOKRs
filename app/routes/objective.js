import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function(params) {
      return Ember.RSVP.hash({
        objective: this.store.find('objective', params.objectiveId),
        quarter:   this.store.find('quarter',   params.quarterId)
      });
    },
    controllerName: 'objective',
    setupController: function(controller, models) {
      this._super(controller,models);
      controller.set('quarter', models.quarter);
      controller.set('model', models.objective);
    },
    actions: {
      archiveObjective: function() {
        var controller = this.controller,
            quarter    = this.get('session.current_quarter');
        // get keyResults from objective
        controller.get('keyResults').then(function(keyResults){
          keyResults = keyResults.toArray();
          keyResults.forEach(function(kr){
            // get keyResultUpdates from keyResult
            kr.get('keyResultUpdates').then(function(keyResultUpdates){
              // destroy keyResultUpdates for the kr
              keyResultUpdates = keyResultUpdates.toArray();
              keyResultUpdates.forEach(function(keyResultUpdate){
                keyResultUpdate.destroyRecord();
              });
            });
            // get deliverables from keyResult
            kr.get('deliverables').then(function(deliverables){
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
              // destroy kr
              kr.destroyRecord();
            }); 
          }); 
          // destroy objective
          controller.get('model').destroyRecord().then(function() {
            controller.transitionToRoute('objectives', this.get('session.organisation'), quarter);
          });
        }); 
      }
    }
  }
);
