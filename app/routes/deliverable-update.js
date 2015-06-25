import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function(params) {
      return this.store.find('deliverableUpdate', params.updateId);
    },
    controllerName: 'deliverableUpdate', 
    setupController: function(controller, model) {
      controller.set('model', model);
    },
    renderTemplate: function() {
      this.render('deliverableUpdate');
    },
    actions: {
      archiveDeliverableUpdate: function() {
        var controller = this.controller,
            self       = this,
            quarter    = controller.get('model.deliverable.keyResult.quarter.id'),
            kr         = controller.get('model.deliverable.keyResult.id'),
            ri         = controller.get('model.deliverable.id');
        controller.get('model').destroyRecord().then(function() {
          controller.transitionToRoute('deliverable', self.get('session.organisation'), quarter, kr, ri);
        });
      }
    }
  }
);
