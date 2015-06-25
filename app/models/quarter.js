import DS from 'ember-data';

var Quarter = DS.Model.extend({
  year:         DS.attr('string'),
  quarter:      DS.attr('string'),
  organisation: DS.belongsTo('organisation', {async: true}),
  keyResults:   DS.hasMany('keyResult',      {async: true}),
  name: function() {
    return this.get('year') + ' Q' + this.get('quarter');
  }.property('year', 'quarter')
});
export default Quarter;
