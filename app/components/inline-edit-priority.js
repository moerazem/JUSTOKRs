import Ember from 'ember';

export default Ember.Component.extend({
  editing: false,
  actions : {
    startEditing: function() {
      this.toggleProperty("editing");
    },
    stopEditing: function() {
      this.toggleProperty("editing");
      this.sendAction('save');
    },
    cancelEditing: function() {
      this.toggleProperty("editing");
    },
    addOne: function() {
      if (isNaN(this.get('value')) || this.get('value') === null) {
        this.set('value', 1);
      } else {
        this.set('value', parseInt(this.get('value')) + 1);
      }
      this.sendAction('add');
      this.toggleProperty("editing");
    },
    subtractOne: function() {
      if (isNaN(this.get('value')) || this.get('value') === null) {
        this.set('value', 0);
       } else {
        this.set('value', parseInt(this.get('value')) - 1);
      }
      this.sendAction('subtract');
      this.toggleProperty("editing");
    },
  }
});
