import Ember from 'ember';

export default Ember.ArrayController.extend({ 
  itemController: 'key-result',
  sortProperties: ['committed:desc', 'operational:asc', 'name:asc'],
  sortedKRs : Ember.computed.sort('model', 'sortProperties')
});
