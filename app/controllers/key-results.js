import Ember from 'ember';

export default Ember.ArrayController.extend({ 
  itemController: 'key-result',
  sortProperties: ['objective.name:asc', 'operational:asc', 'companyGoal:asc', 'name:asc'],
  sortedKRs : Ember.computed.sort('model', 'sortProperties')
});
