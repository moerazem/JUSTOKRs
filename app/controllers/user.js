import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(
  EmberValidations.Mixin,
  {
    needs: "application",
    teamList: '',
    orgList: '',
    roleList: '',
    givenNameErrors: function() {
      var errors = this.get('errors.givenName').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.givenName'),
    surnameErrors: function() {
      var errors = this.get('errors.surname').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.surname'),
    emailErrors: function() {
      var errors = this.get('errors.email').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.email'),
    validations: {
      givenName: { 
        presence: true,
        length: { maximum: 100 }
      },
      surname: { 
        presence: true,
        length: { maximum: 100 }
      },
      email: { 
        presence: true,
        length: { maximum: 100 }
      },
    },
    actions: {
      saveUser: function() {  
        var self = this;
        if (this.get('isValid')) {
          if (self.get('organisation.id') && self.get('role.id')) {
            var onSuccess = function() {
              self.transitionToRoute('users');
            };

            var onFail = function(error) {
              console.log(error);
            };
            self.get('model').set('team', self.get('team.content')); // this seems to be neccesary with ember.data.15 - not quite sure why
            self.get('model').set('organisation', self.get('organisation.content')); // this seems to be neccesary with ember.data.15 - not quite sure why
            self.get('model').set('role', self.get('role.content')); // this seems to be neccesary with ember.data.15 - not quite sure why
            self.get('model').set('name', self.get('email'));
            self.get('model').save().then(onSuccess).catch(onFail);
          } else { // hacky workaround due to inability to validate objective, which is a belongsTo relationship
            self.notify.alert('Need to supply organisation & role');
          }
        }
      },
      discardUser: function() {
        this.transitionToRoute('users');
      }
    }
  }
);
