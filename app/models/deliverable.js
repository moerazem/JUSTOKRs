import DS from 'ember-data';

var Deliverable = DS.Model.extend({
  keyResult: DS.belongsTo('keyResult', {async: true}),
  name: DS.attr('string'),
  description: DS.attr('string'),
  status: DS.attr('string'),
  commentary: DS.attr('string'),
  updateDate: DS.attr('date'),
  team: DS.belongsTo('team', {async: true}),
  priority: DS.attr('number'),
  countryFlag: DS.attr('boolean'),
  teamFlag: DS.attr('boolean'),
  statusChangeDate: DS.attr('date'),
  deliveryDate: DS.attr('date'),
  deliverableUpdates: DS.hasMany('deliverableUpdate', {async: true}),
  noRecentStatus: function() {
    var updateDate = moment(this.get('updateDate'));
    var status     = this.get('status');
    var noRecentStatus = '';
    if ((updateDate.add(7, 'days') < moment() || updateDate.isValid() === false) && status !== 'Operational' ) {
      noRecentStatus = 'info';
    }
    return noRecentStatus;
  }.property('updateDate'),
  noRecentStatusText: function() {
    if (this.get('noRecentStatus')) {
      return 'Please provide a status update - no status update in last seven days.';
    } else {
      return '';
    }
  }.property('noRecentStatus'),
  operational: function() {
    if (this.get('status') === 'Operational') { 
      return 'greyOperational';
    } else {
      return ''; 
    }
  }.property('status'),
  firstDeliverableForTeam: function() {
    var firstTeam = this.get('team.deliverables.firstObject.id');
    if (this.get('id') === firstTeam) {
      return true;
    } else {
      return false;
    }
  }.property('team'),
  offset: function() {
    var status       = this.get('status'),
        deliveryDate = moment(this.get('deliveryDate')),
        offset       = 0; // Backlog is 0
    if (status === 'Discovery') {
      offset = 2;
    }
    if (status === 'In Progress' || status === 'Blocked' || status === 'Deployed') {
      offset = 4;
      if (deliveryDate > moment() && deliveryDate < moment().add(14, 'days') && deliveryDate.isValid()) { // imminent
        offset = 6;
      }
    }
    if (status === 'Operational') {
      offset = 8;
    }
    return 'col-md-offset-' + offset;
  }.property('status', 'deliveryDate'),
  timelineColour: function() {
    var statusChangeDate = moment(this.get('statusChangeDate')),
        deliveryDate     = moment(this.get('deliveryDate')),
        status           = this.get('status'), 
        colour           = 'tlNormal';
    if (statusChangeDate.subtract(7, 'days') <= moment() ) {
      colour = 'tlRecentStatus';
    }
    if (deliveryDate <= moment() && deliveryDate >= moment().subtract(7, 'days') && deliveryDate.isValid() && (status === 'Deployed' || status === 'Operational')) {
      colour = 'tlRecentDelivery';
    }
    if (status === 'Blocked') {
      colour = 'tlBlocked';
    }
    return colour;
  }.property('statusChangeDate', 'deliveryDate', 'status'),
  shortDeliveryDate: function() {
    var deliveryDate = moment(this.get('deliveryDate'));
    if (deliveryDate.isValid()) {
      return deliveryDate.format(' (DD/MM)');
    } else {
      return null;
    }
  }.property('deliveryDate')
});

export default Deliverable;
