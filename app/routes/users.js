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
    model: function() {
      return this.store.find('user');
    },
  }
);
