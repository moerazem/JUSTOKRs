import DS from 'ember-data';

var Role = DS.Model.extend({
  name:       DS.attr('string')
});

export default Role;
