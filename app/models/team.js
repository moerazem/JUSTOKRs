import DS from 'ember-data';

var Team = DS.Model.extend({
  name: DS.attr('string'),
  shortCode: DS.attr('string'),
  techLead: DS.attr('string'),
  organisation: DS.belongsTo('organisation', {async: true}),
  deliverables: DS.hasMany('deliverable', {async: true})
});

export default Team;
