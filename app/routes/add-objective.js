import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function() {
      var obj = this.store.createRecord('objective');
      this.store.find('organisation', this.get('session.organisation')).then(function(organisation) {
        obj.set('organisation', organisation);
      });
      return obj;
    },
    controllerName: 'objective', 
    setupController:function(controller, model) {
      controller.set('model', model);
    },
    renderTemplate: function() {
      this.render('addObjective');
    }
  }
);
