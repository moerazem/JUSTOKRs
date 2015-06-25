import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function(params) {
      var kru = this.store.createRecord('keyResultUpdate');
      this.store.find('keyResult', params.krId).then(function(keyResult) {
        kru.set('keyResult', keyResult);
        kru.set('completionHorizon', keyResult.get('completionHorizon'));
        kru.set('rag', keyResult.get('rag'));
        kru.set('status', keyResult.get('status'));
        kru.set('commentary', keyResult.get('commentary'));
      });
      return kru;
    },
    controllerName: 'keyResultUpdate', 
    setupController: function(controller, model) {
      controller.set('model', model);
    },
    renderTemplate: function() {
      this.render('keyResultUpdate');
    }
  }
);
