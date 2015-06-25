import DS from 'ember-data';

var KeyResultUpdate = DS.Model.extend({
  keyResult: DS.belongsTo('keyResult', {async: true}),
  updateDate: DS.attr('date'),
  rag: DS.attr('string'),
  completionHorizon: DS.attr('number'),
  status: DS.attr('string'),
  commentary: DS.attr('string'),
  archived: DS.attr('boolean'),
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
  }.property('rag')
});

KeyResultUpdate.reopenClass({
  FIXTURES: [
    { id: 1,
      keyResult: 1,
      updateDate: '2014-12-21',
      rag: 'Green',
      completionHorizon: 3,
      status: 'Deployed',
      commentary: 'All Universal analytics updates for Consumer web rolled out.'
    },
    { id: 2,
      keyResult: 1,
      updateDate: '2014-12-28',
      rag: 'Green',
      completionHorizon: 2,
      status: 'In Progress',
      commentary: 'Some Universal analytics updates for Consumer web almost rolled out.'
    }
  ]
});
export default KeyResultUpdate;
