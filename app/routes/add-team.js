import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function() {
      var team = this.store.createRecord('team');
      this.store.find('organisation', this.get('session.organisation')).then(function(organisation) {
        team.set('organisation', organisation);
      });
      return team;
    },
    controllerName: 'addTeam', 
    setupController:function(controller, model) {
      this._super(controller, model);
      var currentQuarter = this.get('session.current_quarter');
      controller.set('quarter', this.store.find('quarter', currentQuarter));
      controller.set('model', model);
    },
    renderTemplate: function() {
      this.render('addTeam');
    }
  }
);
