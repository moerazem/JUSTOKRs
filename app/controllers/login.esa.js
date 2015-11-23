import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(LoginControllerMixin,
  EmberValidations.Mixin,
  {
    authenticator: 'simple-auth-authenticator:oauth2-password-grant',
    identificationErrors: function() {
      var errors = this.get('errors.identification').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.identification'),
    passwordErrors: function() {
      var errors = this.get('errors.password').toString();
      if (errors) { return errors[0].toUpperCase() + errors.slice(1); } else { return null; }
    }.property('errors.password'),
    validations: {
      identification: { 
        presence: true
      },
      password: { 
        presence: true
      }
    }
  }
);
