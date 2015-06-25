import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function(params) {
      return this.store.find('keyResultUpdate', params.updateId);
    },
    controllerName: 'keyResultUpdate', 
    setupController: function(controller, model) {
      controller.set('model', model);
    },
    renderTemplate: function() {
      this.render('keyResultUpdate');
    },
    actions: {
      archiveKeyResultUpdate: function() {
        var controller = this.controller;
        var self       = this;
        var quarter = controller.get('model.keyResult.quarter.id'),
            kr      = controller.get('model.keyResult.id');
        controller.get('model').destroyRecord().then(function() {
          controller.transitionToRoute('keyResult', self.get('session.organisation'), quarter, kr);
        });
      }
    }
  }
);
