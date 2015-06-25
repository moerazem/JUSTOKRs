import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'editObjective',
  didInsertElement: function() {
    // expand the edit view when called from objectives template in edit mode
    if (this.get('controller').edit === 1) { // show in all cases for now
      $('#collapseObjective').collapse('show');
    } 
  }
});
