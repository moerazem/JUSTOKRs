import Ember from 'ember';

export default Ember.Controller.extend({
  roles: [
    {name: "Engineer",           id: 1},
    {name: "Technology Manager", id: 2},
    {name: "Programme Manager",  id: 3}
  ],
  objectiveType: ['Moving metrics', 'Building foundations', 'Reducing Risk', 'Culture'],
  companyGoal: [ "Acquire New Users", "Ensure first time users come back and boost order frequency of existing users", "Provide consumers with best information in the marketplace", "Be comprehensive", "Improve TR's capability to provide a great experience to JE customers", "Attract World Class Talent", "Develop and retain our people", "Engage JEaters with the business", "Reduce Risk", "NO CLEAR MAPPING TO COMPANY GOAL"],
  rag: [ 'Red', 'Amber', 'Green' ],
  status: [ 'Backlog', 'Discovery', 'In Progress', 'Ready for Dev', 'Blocked', 'Deployed', 'Operational' ],
  programmeManager: ['Alexis Ash', 'Becks Henze', 'Chloe Stubbins', 'Gurdeep Thethi', 'Dale Matthews', 'Gordon Bazeley', 'Philippe Peron', 'Olga Marshalko',  'Tarcila Steter']
});
