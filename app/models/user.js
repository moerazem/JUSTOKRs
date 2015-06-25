import DS from 'ember-data';

var User = DS.Model.extend({
  name:         DS.attr('string'),
  email:        DS.attr('string'),
  givenName:    DS.attr('string'),
  surname:      DS.attr('string'),
  organisation: DS.belongsTo('organisation', {async: true}),
  team:         DS.belongsTo('team', {async: true}),
  role:         DS.belongsTo('role', {async: true}),
  staffNumber:  DS.attr('string')
});

export default User;
