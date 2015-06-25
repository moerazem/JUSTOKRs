import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home');
  // summary
  this.route('summary', {path: 'organisations/:organisationId/quarters/:quarterId/summary'});
  // objectives
  this.route('objectives', {path: 'organisations/:organisationId/quarters/:quarterId/objectives'});
  this.resource('objective', {path: 'organisations/:organisationId/quarters/:quarterId/objectives/:objectiveId'}, function() {
    this.resource('objectiveKeyResults');
  });
  this.route('addObjective');
  // teams
  this.route('teams', {path: 'organisations/:organisationId/quarters/:quarterId/teams'});
  this.resource('team', {path: 'organisations/:organisationId/quarters/:quarterId/teams/:teamId'}, function() {
    this.resource('teamDeliverables');
    // this.resource('teamDeliverables2'); // hidden for now as it doesn't work
  });
  this.route('addTeam', {path: 'organisations/:organisationId/quarters/:quarterId/teams/addTeam'});
  this.route('addTeamKeyResult', {path: 'organisations/:organisationId/quarters/:quarterId/teams/:teamId/addTeamKeyResult'});
  // quarters
  this.route('quarters', {path: 'organisations/:organisationId/quarters'});
  this.resource('quarter', {path: 'organisations/:organisationId/quarters/:quarterId'}, function() {
    this.resource('keyResults');
  });
  this.route('keyResult', {path: 'organisations/:organisationId/quarters/:quarterId/keyResults/:krId'});

  this.route('addQuarter', {path: 'organisations/:organisationId/quarters/addQuarter'});
  this.route('addKeyResult', {path: 'organisations/:organisationId/quarters/:quarterId/objective/:objectiveId/addKeyResult'});
  this.route('keyResultUpdate', {path: 'organisations/:organisationId/quarters/:quarterId/keyResults/:krId/update/:updateId'});
  this.route('addKeyResultUpdate', {path: 'organisations/:organisationId/quarters/:quarterId/keyResults/:krId/update/addKeyResultUpdate'});
  this.route('addKeyResultTeam', {path: 'organisations/:organisationId/quarters/:quarterId/keyResults/:krId/addKeyResultTeam'});
  this.route('deliverable', {path: 'organisations/:organisationId/quarters/:quarterId/keyResults/:krId/deliverable/:deliverableId'});
  this.route('addDeliverable', {path: 'organisations/:organisationId/quarters/:quarterId/keyResults/:krId/addDeliverable'});
  this.route('addDeliverableUpdate', {path: 'organisations/:organisationId/quarters/:quarterId/keyResults/:krId/deliverable/:deliverableId/update/addDeliverableUpdate'});
  this.route('deliverableUpdate', {path: 'organisations/:organisationId/quarters/:quarterId/keyResults/:krId/deliverable/:deliverableId/update/:updateId'});
  this.route('login');
  this.route('help');
  this.route('accountTimedOut');
  this.route('capitalisation');
  this.route('userConfig');
  this.route('users');
  this.route('user', {path: 'users/:userId'});
  this.route('add-user');
  this.route('timeline', {path: 'organisations/:organisationId/quarters/:quarterId/timeline'});
  this.route('healthcheck');
  this.route('recordNotFound');
  this.route('notFound', { path: '/*path' });
});

export default Router;
