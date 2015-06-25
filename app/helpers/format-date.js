import Ember from 'ember';

export function formatDate(input) {
  var dateFormat = 'DD/MM/YYYY';
  if (input && input !== "") {
    return moment(input).format(dateFormat);
  } else {
    return null;
  }
}

export default Ember.Handlebars.makeBoundHelper(formatDate);
