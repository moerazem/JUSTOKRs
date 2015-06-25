import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(
  EmberValidations.Mixin,
  {
    quarter: '',
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
            self.transitionToRoute('teams', self.get('session.organisation'), self.get('session.current_quarter'));
          };

          var onFail = function(error) {
            console.log(error);
          };

          self.get('model').save().then(onSuccess).catch(onFail);
        }
      }
    }
  }
);
