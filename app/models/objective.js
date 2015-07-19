import DS from 'ember-data';

var Okr = DS.Model.extend({
  name: DS.attr('string'),
  description:      DS.attr('string'),
  objectiveType:    DS.attr('string'),
  docLink:          DS.attr('string'),
  organisation:     DS.belongsTo('organisation', {async: true}),
  keyResults:       DS.hasMany('keyResult', {async: true})
});

export default Okr;
