import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['year', 'quarter'],
  sortAscending: true
});
