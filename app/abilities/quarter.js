import { Ability } from 'ember-can';
 
export default Ability.extend({
  canAdd: function() {
    if (parseInt(this.get('session.role')) === 3) { // Programme Manager
      return true;
    } else {
      return false;
    }
  }.property('session.role'),
  canEdit: function() {
    if (parseInt(this.get('session.role')) === 3) { // Programme Manager
      return true;
    } else {
      return false;
    }
  }.property('session.role')
});
