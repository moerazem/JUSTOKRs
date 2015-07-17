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
    deliveryDateISO: function() {
      var date   = this.get('deliveryDate'),
          format = this.get('formatISO');
      // if the update has a date then convert to ISO for display
      if (date) { 
        return moment(date).format(format); 
      } else {
        return null;
      }
    }.property('deliveryDate', 'formatISO'),
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
      status: { presence: true },
      commentary: { 
        presence: true,
        length: { maximum: 750 }
      }
    },
    actions: {
      saveDeliverableUpdate: function() {  
        var self = this;
        if (this.get('isValid')) {
          if (self.get('updateDateISO')) {
            self.set('updateDate', new Date(self.get('updateDateISO')));
          }
          if (typeof(self.get('deliveryDateISO')) !== "undefined" && self.get('deliveryDateISO') !== "" && self.get('deliveryDateISO') !== null) {
            self.set('deliveryDate', new Date(self.get('deliveryDateISO')));
          } else {
            self.set('deliveryDate', "");
          }
          self.set('deliveryDateISO', null);

          if (self.get('status') === 'Operational') {
            self.get('deliverable').then(function(d) { // set Operational deliverables to bottom of list
              d.set('priority', 99);
              d.save();
            });
          }
          if (self.get('status') !== self.get('deliverable.status') && self.get('deliverable.status')) { // set statusChangeDate if the status changed
            self.get('deliverable').then(function(d) { // set Operational deliverables to bottom of list
              d.set('statusChangeDate', new Date(moment().format(self.get('formatISO')))); 
              d.save();
            });
          }
          var onSuccess = function(record) {
            if (self.get('referrer') === 'timeline') {
              self.transitionToRoute('timeline', self.get('session.organisation'), record.get('deliverable.keyResult.quarter.id'));
            } else {
              if (record.get('deliverable.team.id') && (self.get('referrer') === 'team-deliverables')) {
                self.transitionToRoute('teamDeliverables', self.get('session.organisation'), record.get('deliverable.keyResult.quarter.id'), record.get('deliverable.team.id'));
              } else {
                self.transitionToRoute('deliverable', self.get('session.organisation'), record.get('deliverable.keyResult.quarter.id'), record.get('deliverable.keyResult.id'), record.get('deliverable.id'));
              }
            }
          };

          var onFail = function(error) {
            console.log(error);
          };

          self.get('model').set('timeline', self.get('timeline')); // this seems to be neccesary with ember.data.15 - not quite sure why
          self.get('model').save().then(onSuccess).catch(onFail);
        }
      },
      discardNewDeliverableUpdate: function() {
        var model = this.get('model');
        model.deleteRecord();
        if (this.get('referrer') === 'timeline') {
          this.transitionToRoute('timeline', this.get('session.organisation'), this.get('deliverable.keyResult.quarter.id'));
        } else if (this.get('referrer') === 'team-deliverables') {
          this.transitionToRoute('teamDeliverables', this.get('session.organisation'), this.get('deliverable.keyResult.quarter.id'), this.get('deliverable.team.id'));
        } else {
          this.transitionToRoute('deliverable', this.get('session.organisation'), this.get('deliverable.keyResult.quarter.id'), this.get('deliverable.keyResult.id'), this.get('deliverable.id'));
        }
      },
      discardDeliverableUpdate: function() {
        this.transitionToRoute('deliverable', this.get('session.organisation'), this.get('deliverable.keyResult.quarter.id'), this.get('deliverable.keyResult.id'), this.get('deliverable.id'));
      }
    }
  }
);
