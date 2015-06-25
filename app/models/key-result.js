import DS from 'ember-data';
import ENV from 'okr/config/environment';

var KeyResult = DS.Model.extend({
  companyGoal: DS.attr('string'),
  objective: DS.belongsTo('objective', {async: true}),
  name: DS.attr('string'),
  rag: DS.attr('string'),
  completionHorizon: DS.attr('number'),
  horizonHistory:   DS.attr('string'),
  status:           DS.attr('string'),
  commentary:       DS.attr('string'),
  capitalisable:    DS.attr('boolean'),
  jiraKR:           DS.attr('string'),
  risks:            DS.attr('string'),
  docLink:          DS.attr('string'),
  committed:        DS.attr('boolean'),
  quarter:          DS.belongsTo('quarter', {async: true}),
  teams:            DS.hasMany('team', {async: true}),
  keyResultUpdates: DS.hasMany('keyResultUpdate', {async: true}),
  deliverables:     DS.hasMany('deliverable', {async: true}),
  commentaryCR : function() {
    var commentary = this.get('commentary');
    if (commentary) {
      return commentary.replace(/\n/g,"<br>");
    } else {
      return null;
    }
  }.property('commentary'),
  operational: function() {
    if (this.get('status') === 'Operational') { 
      return 'greyOperational';
    } else {
      return ''; 
    }
  }.property('status'),
  ragColour: function() {
    var rag       = this.get('rag'),
        ragColour = '';
    if (rag === 'Red') {
      ragColour = 'danger';
    }
    if (rag === 'Amber') {
      ragColour = 'warning';
    }
    if (rag === 'Green') {
      ragColour = 'success';
    }
    return ragColour;
  }.property('rag'),
  jiraURL: function() {
    var kr = this.get('jiraKR');
    return ENV.JIRA_HOST + '/issues/?jql="Key Result"='+kr+' and status != "In Production" and status != "Resolved" order by status desc';
  }.property('jiraKR')
});

export default KeyResult;
