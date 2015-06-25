import DS from 'ember-data';

var DeliverableUpdate = DS.Model.extend({
  deliverable: DS.belongsTo('deliverable', {async: true}),
  updateDate: DS.attr('date'),
  status: DS.attr('string'),
  commentary: DS.attr('string'),
  countryFlag: DS.attr('boolean'),
  teamFlag: DS.attr('boolean'),
  deliveryDate: DS.attr('date'),
  showDeliveryDate: function() {
    var status = this.get('status');
    if (status === 'In Progress' || status === 'Blocked' || status === 'Deployed' || status === 'Operational') {
      return true;
    } else {
      return false;
    }
  }.property('status'),
});

export default DeliverableUpdate;
