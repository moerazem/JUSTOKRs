import Ember from 'ember';

export default Ember.Controller.extend({
  organisation: '',
  actions: {
    changeOrg: function() {
      this.set('session.organisation_name', this.get('organisation.name'));
      this.set('session.organisation', this.get('organisation.id'));
      this.set('session.role', null);
      this.transitionToRoute('summary', this.get('session.organisation'), this.get('session.current_quarter'));
    },
    resetOrg: function() {
      this.set('session.organisation_name', this.get('session.user_organisation_name'));
      this.set('session.organisation', this.get('session.user_organisation'));
      this.set('session.role', this.get('session.user_role'));
      this.transitionToRoute('summary', this.get('session.organisation'), this.get('session.current_quarter'));
    }
  }
});
