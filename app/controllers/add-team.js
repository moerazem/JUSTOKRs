import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(
  EmberValidations.Mixin,
  {
    needs: "application",
    nameErrors: function() {
      var errors = this.get('errors.name').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.name'),
    shortCodeErrors: function() {
      var errors = this.get('errors.shortCode').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.shortCode'),
    validations: {
      name: { 
        presence: true,
        length: { maximum: 50 }
      },
      shortCode: { 
        presence: true,
        length: { maximum: 6 }
      }
    },
    actions: {
      saveTeam: function() {  
        var self = this;
        if (this.get('isValid')) {
          var onSuccess = function() {
            self.transitionToRoute('teams', self.get('session.organisation'), self.get('quarter.id'));
          };

          var onFail = function() {
          };
          self.get('model').save().then(onSuccess).catch(onFail);
        }
      },
      discardTeam: function() {
        var model = this.get('model');
        model.deleteRecord();
        this.transitionToRoute('teams', this.get('session.organisation'), this.get('quarter.id'));
      }
    }
  }
);
