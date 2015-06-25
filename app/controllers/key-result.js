import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(
  EmberValidations.Mixin,
  {
    needs: ["application"],
    queryParams: ['edit'],
    edit: 0,
    nameErrors: function() {
      var errors = this.get('errors.name').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.name'),
    watchCapitalisable: function(){
      this.get("model").save();
    }.observes('capitalisable'),
    validations: {
      name: { 
        presence: true,
        length: { maximum: 300 }
      }
    },
    actions: {
      saveKeyResult: function() {  
        var self = this;
        if (this.get('isValid')) {
          var onSuccess = function(record) {
            self.transitionToRoute('objectiveKeyResults', self.get('session.organisation'), record.get('quarter.id'), record.get('objective.id'));
          };

          var onFail = function() {
            self.notify.alert("You don't have permission to change this data.");
            self.get('model').rollback();
          };

          self.get('model').save().then(onSuccess).catch(onFail);
        }
      },
      saveInline: function() {
        this.get('model').save();
      },
      cancelInline: function() {
        this.get('model').rollback();
      },
    }
  }
);
