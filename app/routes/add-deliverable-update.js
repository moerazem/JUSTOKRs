import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function(params) {
      var riu = this.store.createRecord('deliverableUpdate');
      this.store.find('deliverable', params.deliverableId).then(function(deliverable) {
        riu.set('deliverable',  deliverable);
        riu.set('status',       deliverable.get('status'));
        riu.set('commentary',   deliverable.get('commentary'));
        riu.set('timeline',     deliverable.get('timeline'));
        riu.set('countryFlag',  deliverable.get('countryFlag'));
        riu.set('teamFlag',     deliverable.get('teamFlag'));
        riu.set('deliveryDate', deliverable.get('deliveryDate'));
      });
      return riu;
    },
    controllerName: 'deliverableUpdate', 
    setupController: function(controller, model) {
      controller.set('model', model);
    },
    renderTemplate: function() {
      this.render('deliverableUpdate');
    }
  }
);
