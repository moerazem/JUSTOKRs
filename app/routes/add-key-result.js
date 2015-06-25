import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function(params) {
      var kr = this.store.createRecord('keyResult');
      if (params.quarterId > 0) {
        this.store.find('quarter', params.quarterId).then(function(quarter) {
          kr.set('quarter', quarter);
        });
      }
      if (params.objectiveId > 0) { // will be supplied if called from objective but not from summary or team
        this.store.find('objective', params.objectiveId).then(function(objective) {
          kr.set('objective', objective);
        });
      }
      kr.set('committed', true);
      return kr;
    },
    controllerName: 'addKeyResult', 
    setupController:function(controller, model) {
      this._super(controller,model);
      controller.set('model', model);
      controller.set('objectives', this.store.find('objective', {organisation: this.get('session.organisation')}));
      controller.set('quarters', this.store.find('quarter'));
    },
    renderTemplate: function() {
      this.render('addKeyResult');
    }
  }
);
