import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import { CanMixin } from 'ember-can';

export default Ember.Route.extend(
  AuthenticatedRouteMixin, 
  CanMixin,
  {
    beforeModel: function() {
      if (!this.can('view users')) {
        this.transitionTo('index');
      }
    },
    model: function(params) {
      return Ember.RSVP.hash({
        user:  this.store.find('user', params.userId), 
        teams: this.store.find('team'),
        organisations: this.store.find('organisation'),
        roles: this.store.find('role')
      });
    },
    setupController: function(controller, model) {
      this._super(controller,model);
      controller.set('model', model.user);
      controller.set('teamList', model.teams);
      controller.set('orgList', model.organisations);
      controller.set('roleList', model.roles);
    }
  }
);
