import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(
  EmberValidations.Mixin,
  {
    needs: "application",
    quarterErrors: function() {
      var errors = this.get('errors.quarter').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.quarter'),
    yearErrors: function() {
      var errors = this.get('errors.year').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.year'),
    validations: {
      quarter: { 
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 1,
          lessThanOrEqualTo: 4
        }
      },
      year: { 
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 2014,
          lessThanOrEqualTo: 2020
        }
      },
    },
    actions: {
      saveQuarter: function() {  
        var self = this;
        if (this.get('isValid')) {
          var model = self.get('model');
          model.save();
          self.transitionToRoute('quarters', this.get('session.organisation'));
        }
      },
      discardChanges: function() {
        var model = this.get('model');
        model.deleteRecord();
        this.transitionToRoute('quarters', this.get('session.organisation'));
      },
      archiveQuarter: function() {
        var self  = this,
        quarter   = this.get('model');

        // get keyResults from quarter
        quarter.get('keyResults').then(function(keyResults){
          keyResults = keyResults.toArray();
          keyResults.forEach(function(kr){
            // get keyResultUpdates from keyResult
            kr.get('keyResultUpdates').then(function(keyResultUpdates){
              // destroy keyResultUpdates for the kr
              keyResultUpdates = keyResultUpdates.toArray();
              keyResultUpdates.forEach(function(keyResultUpdate){
                keyResultUpdate.destroyRecord();
              });
              // get deliverables from keyResult
              kr.get('deliverables').then(function(deliverables){
                // destroy deliverables for the kr
                deliverables = deliverables.toArray();
                deliverables.forEach(function(deliverable){
                  // get devliverableUpdates from deliverable
                  deliverable.get('deliverableUpdates').then(function(deliverableUpdates){
                    // destroy deliverableUpdates for the deliverable
                    deliverableUpdates = deliverableUpdates.toArray();
                    deliverableUpdates.forEach(function(deliverableUpdate){
                      deliverableUpdate.destroyRecord();
                    });
                    deliverable.destroyRecord();
                  });
                });
              });
            }); 
            // destroy kr
            kr.destroyRecord();
            self.store.unloadRecord(kr);
          }); 
          // destroy quarter
          quarter.destroyRecord();
          self.store.unloadRecord(quarter);
          self.transitionToRoute('quarters', this.get('session.organisation'));
        }); 
      }
    }
  }
);
