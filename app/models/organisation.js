import DS from 'ember-data';

var Organisation = DS.Model.extend({
  name:       DS.attr('string')
});

export default Organisation;
