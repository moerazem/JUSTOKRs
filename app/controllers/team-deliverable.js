import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(
  EmberValidations.Mixin,
  {
    needs: ["application"],
    priorityErrors: function() {
      var errors = this.get('errors.priority').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.priority'),
    validations: {
      priority: { 
        presence: true,
        numericality: true
      }
    },
    actions: {
      addPriority: function() {
        if (this.get('isValid')) {
          this.get('model').save();
        }
      },
      subtractPriority: function() {
        if (this.get('isValid')) {
          this.get('model').save();
        }
      },
      savePriority: function() {
        if (this.get('isValid') && this.get('isDirty')) {
          this.get('model').save();
        } else {
          this.notify.warning('Invalid priority: ' + this.get('priorityErrors'), {closeAfter: 5000});
        }
      },
      rollbackPriority: function() {
        this.get('model').rollback();
      }
    }
  }
);
