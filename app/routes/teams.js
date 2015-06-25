import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(
  AuthenticatedRouteMixin,
  {
    model: function(params) {
      return Ember.RSVP.hash({
        teams:        this.store.find('team', {organisation: params.organisationId, quarter: params.quarterId}).then(sortFunc),
        quarter:      this.store.find('quarter', params.quarterId)
      });
      function sortFunc(items){
        var sortProperties = ["name"];
        items = Ember.ArrayProxy.extend(Ember.SortableMixin).create(items);
        items.set('sortProperties', sortProperties);
        items.set('sortAscending', true);
        return items;
      }
    },
    controllerName: 'teams',
    setupController: function(controller, models) {
      this._super(controller, models);
      controller.set('quarter', models.quarter);
      controller.set('content', models.teams);
    }
  }
);
