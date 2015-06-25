import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: 'team-deliverable',
  sortProperties: ['team.name:asc', 'priority:asc', 'name:asc'],
  sortedItems : Ember.computed.sort('model', 'sortProperties'),
});
