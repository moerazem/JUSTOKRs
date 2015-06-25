import { Ability } from 'ember-can';
 
export default Ability.extend({
  canView: function() {
    if (parseInt(this.get('session.role')) === 3) { // Programme Manager
      return true;
    } else {
      return false;
    }
  }.property('session.user')
});
