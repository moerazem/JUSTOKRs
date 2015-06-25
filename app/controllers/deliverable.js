import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(
  EmberValidations.Mixin,
  {
    needs: "application",
    queryParams: ['edit', 'referrer'],
    edit: 0,
    referrer: '',
    teamList: '',
    krList: '',
    statusDate: function() {
      return moment().format('YYYY-MM-DD');
    },
    nameErrors: function() {
      var errors = this.get('errors.name').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.name'),
    priorityErrors: function() {
      var errors = this.get('errors.priority').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.priority'),
    validations: {
      name: { 
        presence: true,
        length: { maximum: 100 }
      },
      priority: { 
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 0,
          lessThanOrEqualTo: 99
        }
      },
    },
    actions: {
      saveDeliverable: function() {  
        var self = this;
        if (this.get('isValid')) {
          if (self.get('team.id') && self.get('keyResult.id')) {
            var onSuccess = function(record) {
              self.transitionToRoute('keyResult', self.get('session.organisation'), record.get('keyResult.quarter.id'), record.get('keyResult.id'));
            };

            var onFail = function(error) {
              console.log(error);
            };
            self.get('model').set('team', self.get('team.content')); // this seems to be neccesary with ember.data.15 - not quite sure why
            self.get('model').set('keyResult', self.get('keyResult.content')); // this seems to be neccesary with ember.data.15 - not quite sure why
            self.get('model').save().then(onSuccess).catch(onFail);
          } else { // hacky workaround due to inability to validate objective, which is a belongsTo relationship
            self.notify.alert('Need to supply key result & team');
          }
        }
      },
      discardDeliverable: function() {
        var model = this.get('model');
        model.deleteRecord();
        if (this.get('keyResult.id')) {
          this.transitionToRoute('keyResult', this.get('session.organisation'), this.get('keyResult.quarter.id'), this.get('keyResult.id'));
        } else {
          this.transitionToRoute('summary', this.get('session.organisation'), this.get('session.quarter'));
        }
      }
    }
  }
);
