import Ember from 'ember';
import EmberValidations from 'ember-validations';
export default Ember.ObjectController.extend(
  EmberValidations,
  {
    needs: "application",
    queryParams: ['referrer'],
    referrer: '',
    objectives: '',
    nameErrors: function() {
      var errors = this.get('errors.name').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.name'),
    companyGoalErrors: function() {
      var errors = this.get('errors.companyGoal').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.companyGoal'),
    validations: {
      name: { 
        presence: true,
        length: { maximum: 300 }
      },
      companyGoal: { 
        presence: true
      }
    },
    actions: {
      saveKeyResult: function() {  
        var self = this;
        if (this.get('isValid')) {
          if (self.get('objective.id') && self.get('quarter.id')) {
            var model = self.get('model');

            var onSuccess = function(record) {
              if (self.get('referrer') === 'objective') {
                self.transitionToRoute('objectiveKeyResults', self.get('session.organisation'), record.get('quarter.id'), record.get('objective.id'));
              } else if (self.get('referrer') === 'quarters') {
                self.transitionToRoute('quarters', self.get('session.organisation'));
              } else {
                self.transitionToRoute('keyResults', self.get('session.organisation'), record.get('quarter.id'));
              }
            };

            var onFail = function() {
            };
            model.set('objective', self.get('objective.content')); // this seems to be neccesary with ember.data.15 - not quite sure why
            model.set('quarter', self.get('quarter.content')); // this seems to be neccesary with ember.data.15 - not quite sure why
            model.save().then(onSuccess).catch(onFail);
          } else { // hacky workaround due to inability to validate objective, which is a belongsTo relationship
            self.notify.alert('Need to supply objective & quarter');
          }
        }
      },
      discardKeyResult: function() {
        var model = this.get('model');
        model.deleteRecord();
        if (this.get('referrer') === 'objective') {
          this.transitionToRoute('objectiveKeyResults', this.get('session.organisation'), this.get('quarter.id'), this.get('objective.id'));
        } else if (this.get('referrer') === 'quarters') {
          this.transitionToRoute('quarters', this.get('session.organisation'));
        } else {
          this.transitionToRoute('keyResults', this.get('session.organisation'), this.get('quarter.id'));
        }
        // if (this.get('objective.id') && this.get('quarter.id')) {
        //   this.transitionToRoute('objectiveKeyResults', this.get('session.organisation'), this.get('quarter.id'), this.get('objective.id'));
        // } else if (this.get('quarter.id')) {
        //   this.transitionToRoute('keyResults', this.get('session.organisation'), this.get('quarter.id'));
        // } else {
        //   this.transitionToRoute('summary', this.get('session.organisation'), this.get('session.quarter'));
        // }
      }
    }
  }
);
