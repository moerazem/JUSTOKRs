import DS from 'ember-data';

var VersionUpdate = DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  releaseDate: DS.attr('date')
});

export default VersionUpdate;
