import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(
  EmberValidations.Mixin,
  {
    needs: "application",
    queryParams: ['referrer'],
    referrer: '',
    formatISO: "YYYY-MM-DD",
    updateDateISO: function() {
      var date   = this.get('updateDate'),
          format = this.get('formatISO');
      // if the update has a date then convert to ISO for display, otherwise use todays date
      if (date) { 
        return moment(date).format(format); 
      } else { 
        return moment().format(format); 
      }
    }.property('updateDate', 'formatISO'),
    ragErrors: function() {
      var errors = this.get('errors.rag').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.rag'),
    statusErrors: function() {
      var errors = this.get('errors.status').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.status'),
    commentaryErrors: function() {
      var errors = this.get('errors.commentary').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.commentary'),
    validations: {
      updateDateISO: { presence: true },
      // rag: { presence: true }, // disabled as at beginning of quarter want items that haven't been started to have no RAG 
      status: { presence: true },
      commentary: { 
        presence: true,
        length: { maximum: 2000 }
      }
    },
    actions: {
      saveKeyResultUpdate: function() {  
        var self = this;
        if (this.get('isValid')) {
          if (self.get('updateDateISO')) {
            self.set('updateDate', new Date(self.get('updateDateISO')));
          }

          var onSuccess = function(record) {
            if (self.get('referrer') === 'key-results') {
              self.transitionToRoute('keyResults', self.get('session.organisation'), record.get('keyResult.quarter.id'));
            } else if (self.get('referrer') === 'objective-key-results') {
              self.transitionToRoute('objectiveKeyResults', self.get('session.organisation'), record.get('keyResult.quarter.id'), record.get('keyResult.objective.id'));
            } else {
              self.transitionToRoute('keyResult', self.get('session.organisation'), record.get('keyResult.quarter.id'), record.get('keyResult.id'));
            }
          };

          var onFail = function() {
          };

          self.get('model').save().then(onSuccess).catch(onFail);
        }
      },
      discardNewKeyResultUpdate: function() {
        var model = this.get('model');
        model.deleteRecord();
        if (this.get('referrer') === 'key-results') {
          this.transitionToRoute('keyResults', this.get('session.organisation'), this.get('keyResult.quarter.id'));
        } else if (this.get('referrer') === 'objective-key-results') {
          this.transitionToRoute('objectiveKeyResults', this.get('session.organisation'), this.get('keyResult.quarter.id'), this.get('keyResult.objective.id'));
        } else {
          this.transitionToRoute('keyResult', this.get('session.organisation'), this.get('keyResult.quarter.id'), this.get('keyResult.id'));
        }
      },
      discardKeyResultUpdate: function() {
        this.transitionToRoute('keyResult', this.get('session.organisation'), this.get('keyResult.quarter.id'), this.get('keyResult.id'));
      },
      copyRICommentary: function() {
        var allRICommentary = '';
        this.get('keyResult.deliverables').forEach(function(ri) {
          if (typeof(ri.get('commentary')) !== 'undefined' && ri.get('commentary') !== null) {
            var lastChar = ri.get('commentary').slice(-1);
            allRICommentary = allRICommentary + ri.get('commentary'); 
            if (lastChar !== '.') { // if last character isn't a full stop add a full stop
              allRICommentary = allRICommentary + '. '; 
            }
          }
        });
        this.set('commentary', allRICommentary.slice(0, -1));
      }
    }
  }
);
