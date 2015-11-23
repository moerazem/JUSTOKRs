import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(
  EmberValidations,
  {
    quarter: '',
    needs: ["application", "objectives"],
    nameErrors: function() {
      var errors = this.get('errors.name').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.name'),
    validations: {
      name: { 
        presence: true
      }
    },
    actions: {
      saveObjective: function() {  
        var self = this;
        this.validate().then(function() {
          var onSuccess = function() {
            if (self.get('controllers.objectives.quarter.id')) {
              self.transitionToRoute('objectives', self.get('session.organisation'), self.get('controllers.objectives.quarter.id'));
            } else {
              self.transitionToRoute('objectives', self.get('session.organisation'), self.get('session.current_quarter'));
            }
            self.refresh(); // reload the data so that the latest update is shown on the keyResults page
          };

          var onFail = function() {
          };

          self.get('model').save().then(onSuccess).catch(onFail);
        }).catch(function() {
          // it shouldn't be possible to get here ...
        });
      },
      discardChanges: function() {
        var model = this.get('model');
        model.deleteRecord();
        this.store.unloadRecord(model);
        this.transitionToRoute('objectives', this.get('session.organisation'), this.get('controllers.objectives.quarter.id'));
      }
    }
  }
);
