import DS from 'ember-data';
import ENV from 'okr/config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.APP.API_HOST, // get this from /config/environment.js
  coalesceFindRequests: true,
  headers: function() {
    // this is a bit of a nasty hack to inject params currently being viewed into the header 
    // quarter needed for the summary page to ensure that the correct quarter is passed to objective when refreshing
    //   is set in key-results route and unpacked in api_objective
    // organisation needed for getQuarter for keyResult page
    //   unpacked in api_quarter
    // organisation needed for getDeliverables for timeline page
    //   unpacked in api_deliverable
    return {
      "quarter":      this.get('session.quarter'),
      "organisation": this.get('session.organisation')
    };
  }.property().volatile()
});

// allow queries to be made against fixture data, this section to be commented out if using REST adapter
// export default DS.FixtureAdapter.extend({
//   queryFixtures: function(records, query) {        
//     return records.filter(function(record) {
//       for(var key in query) {
//         if (!query.hasOwnProperty(key)) { continue; }
//           var value = query[key];
//         if (record[key] !== value) { return false; }
//       }
//       return true;
//     });
//   }
// });
