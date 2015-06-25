import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function(params) {
      var d = this.store.createRecord('deliverable');
      if (params.krId > 0) {
        this.store.find('keyResult', params.krId).then(function(keyResult) {
          d.set('keyResult', keyResult);
        });
      }
      d.set('priority', 0);
      return d;
    },
    controllerName: 'deliverable', 
    setupController:function(controller, model) {
      this._super(controller,model);
      controller.set('model', model);

      // set the quarter so it can be passed in the API call header for objectives
      controller.set('keyResults', this.store.find('keyResult', {organisation: this.get('session.organisation'), quarter: this.get('session.quarter'), committed: 1}));
      controller.set('teams', this.store.find('team', {organisation: this.get('session.organisation')}));
    },
    renderTemplate: function() {
      this.render('addDeliverable');
    }
  }
);
