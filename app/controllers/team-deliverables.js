import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: 'team-deliverable',
  sortProperties: ['priority', 'name'],
  sortAscending: true
});
