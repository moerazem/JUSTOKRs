import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import { CanMixin } from 'ember-can';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  CanMixin,
  {
    beforeModel: function() {
      if (!this.can('view capitalisation')) {
        this.transitionTo('index');
      }
    },
    model: function() {
      this.set('session.quarter', this.get('session.current_quarter'));
      return this.store.find('keyResult', {organisation: this.get('session.organisation'), quarter: this.get('session.current_quarter'), committed: 1});
    }
  }
);
