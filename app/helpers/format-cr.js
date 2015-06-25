import Ember from 'ember';

export function formatCr(input) {
  if (input) {
    return input.replace(/\n/g,"<br>");
  } else {
    return null;
  }
}

export default Ember.Handlebars.makeBoundHelper(formatCr);
