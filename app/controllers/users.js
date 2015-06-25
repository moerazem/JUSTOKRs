import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['organisation.name:desc', 'surname:asc', 'givenName:asc'],
  sortedUsers : Ember.computed.sort('model', 'sortProperties')
});
