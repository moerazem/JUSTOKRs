'use strict';
var   common               = require('./common'),
      log                  = common.log,
      apiCommon            = require('./api_common'),
      apiAuthAdfs          = require('./api_auth_adfs'),
      apiQuarter           = require('./api_quarter'),
      apiObjective         = require('./api_objective'),
      apiTeam              = require('./api_team'),
      apiUser              = require('./api_user'),
      apiOrganisation      = require('./api_organisation'),
      apiRole              = require('./api_role'),
      apiKeyResult         = require('./api_key_result'),
      apiKeyResultUpdate   = require('./api_key_result_update'),
      apiDeliverable       = require('./api_deliverable'),
      apiDeliverableUpdate = require('./api_deliverable_update'),
      apiVersionUpdate     = require('./api_version_update'),
      fs                   = require('fs'),
      moment               = require('moment'),
      schedule             = require('node-schedule');

var serverOptions  = {
  name        : 'okr', 
  version     : "1.7.4"
};

const server = apiCommon.restify.createServer(serverOptions);
apiCommon.restify.CORS.ALLOW_HEADERS.push('authorization');
apiCommon.restify.CORS.ALLOW_HEADERS.push('quarter');
apiCommon.restify.CORS.ALLOW_HEADERS.push('organisation');
server
  .use(apiCommon.restify.CORS({origins: common.emberIP}))
  .use(apiCommon.restify.fullResponse())
  .use(apiCommon.restify.gzipResponse())
  .use(apiCommon.restify.bodyParser())
  .use(apiCommon.restify.queryParser())
  .use(apiCommon.passport.initialize());

// start the restify server
server.listen(3000, function () {
  this.log = log.child({ action: 'api' }); 
  this.log.info('%s listening at %s', server.name, server.url);
});

// routes used to issue and verify authentication tokens - ADFS style
server.post('/adfsLogin', apiAuthAdfs.adfsLogin);
server.post('/adfsCheck', apiAuthAdfs.adfsCheck);
apiCommon.passport.use(new apiCommon.passportBearer.Strategy(apiAuthAdfs.verifyToken));

// APIs that return data to Ember frontend
server.get('/quarters', apiQuarter.getQuarters);
server.get('/quarters/:id', apiQuarter.getQuarter);
server.post('/quarters', apiQuarter.postQuarter);
server.put('/quarters/:id', apiQuarter.putQuarter);
server.del('/quarters/:id', apiQuarter.archiveQuarter);

server.get('/objectives', apiObjective.getObjectives);
server.get('/objectives/:id', apiObjective.getObjective);
server.post('/objectives', apiObjective.postObjective);
server.put('/objectives/:id', apiObjective.putObjective);
server.del('/objectives/:id', apiObjective.archiveObjective);

server.get('/teams', apiTeam.getTeams);
server.get('/teams/:id', apiTeam.getTeam);
server.post('teams', apiTeam.postTeam);
server.put('/teams/:id', apiTeam.putTeam);
server.del('/teams/:id', apiTeam.archiveTeam);

server.get('/keyResults', apiKeyResult.getKeyResults);
server.get('/keyResults/:id', apiKeyResult.getKeyResult);
server.post('/keyResults', apiKeyResult.postKeyResult);
server.put('/keyResults/:id', apiKeyResult.putKeyResult);
server.del('/keyResults/:id', apiKeyResult.archiveKeyResult);

server.get('/keyResultUpdates', apiKeyResultUpdate.getKeyResultUpdates);
server.get('/keyResultUpdates/:id', apiKeyResultUpdate.getKeyResultUpdate);
server.post('/keyResultUpdates', apiKeyResultUpdate.postKeyResultUpdate);
server.put('/keyResultUpdates/:id', apiKeyResultUpdate.putKeyResultUpdate);
server.del('/keyResultUpdates/:id', apiKeyResultUpdate.archiveKeyResultUpdate);

server.get('/deliverables', apiDeliverable.getDeliverables);
server.get('/deliverables/:id', apiDeliverable.getDeliverable);
server.post('/deliverables', apiDeliverable.postDeliverable);
server.put('/deliverables/:id', apiDeliverable.putDeliverable);
server.del('/deliverables/:id', apiDeliverable.archiveDeliverable);

server.get('/deliverableUpdates', apiDeliverableUpdate.getDeliverableUpdates);
server.get('/deliverableUpdates/:id', apiDeliverableUpdate.getDeliverableUpdate);
server.post('/deliverableUpdates', apiDeliverableUpdate.postDeliverableUpdate);
server.put('/deliverableUpdates/:id', apiDeliverableUpdate.putDeliverableUpdate);
server.del('/deliverableUpdates/:id', apiDeliverableUpdate.archiveDeliverableUpdate);

server.get('/users', apiUser.getUsers);
server.get('/users/:id', apiUser.getUser);
server.post('/users', apiUser.postUser);
server.put('/users/:id', apiUser.putUser);

server.get('/organisations', apiOrganisation.getOrganisations);
server.get('/organisations/:id', apiOrganisation.getOrganisation);

server.get('/roles', apiRole.getRoles);
server.get('/roles/:id', apiRole.getRole);

server.get('/versionUpdates', apiVersionUpdate.getVersionUpdates);
