import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'editTeam',
  didInsertElement: function() {
    // expand the edit view when called from seasons template in edit mode
    if (this.get('controller').edit === 1) { // show in all cases for now
      $('#collapseTeam').collapse('show');
    } 
  }
});
