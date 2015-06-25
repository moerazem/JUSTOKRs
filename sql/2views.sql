-- used in /objectives
create or replace view objectiveKeyResultsConcat as 
select o.id,
       o.name,
       o.description,
       o.programmeManager,
       o.engResp,
       o.productResp,
       o.uxDesResp,
       o.uxResResp,
       o.biResp,
       o.objectiveType,
       o.engineers,
       o.organisation,
       o.docLink,
       kr.quarter,
       group_concat(kr.id) keyResults 
from   objective o
left join     keyResult kr
on     o.id      = kr.objective
and    ifnull(kr.archived, false) = false
where  ifnull(o.archived, false)  = false
group by o.id, kr.quarter
order by o.id, kr.quarter desc
;

-- used in /quarters
create or replace view quarterKeyResultsConcat as 
select q.id,
       q.year,
       q.quarter,
       o.organisation,
       group_concat(kr.id) keyResults 
from   quarter q
left join     keyResult kr
on     q.id      = kr.quarter
and    ifnull(kr.archived, false) = false
left join   objective o
on     kr.objective = o.id
and  ifnull(o.archived, false)    = false
where  ifnull(q.archived, false)  = false
group by q.id, o.organisation
order by q.year, q.quarter desc
;

-- used in /teams
create or replace view deliverableTeams as
select d.id, 
       d.name,
       d.team,
       d.archived,
       d.priority,
       kr.quarter
from   deliverable d
join   keyResult kr
on     d.keyResult = kr.id
and    ifnull(d.archived,  false) = false
and    ifnull(kr.archived, false) = false
;

-- used in /teams
create or replace view teamDeliverablesConcat as
select t.id,
       t.name, 
       t.shortCode,
       t.techLead,
       t.organisation,
       d.quarter,
       group_concat(d.id order by d.priority asc, d.name) deliverables
from   team t
left join deliverableTeams d
on     t.id = d.team
where  ifnull(t.archived, false)  = false
group by t.id, d.quarter
order by t.name
;

-- latest update per keyResult - used in /keyResults
create or replace view latestKeyResultUpdates as
select kru.keyResult,
       kru.rag,
       kru.completionHorizon,
       kru.status,
       kru.commentary
from   keyResultUpdate kru
where  kru.id in ( select max(id) 
                   from   keyResultUpdate 
                   where  ifnull(archived, false) = false
                   group by keyResult ) 
and    ifnull(kru.archived, false) = false
order by kru.keyResult
;

-- completion horizon history per keyResult - used in /keyResults
create or replace view horizonHistory as
select keyResult,
       group_concat(completionHorizon order by keyResult, updateDate) horizonHistory
from   keyResultUpdate
where  ifnull(archived, false) = false
group by keyResult
; 

-- teams for KR - used in /keyResults
create or replace view keyResultTeams as
select distinct t.name,
                d.keyResult
from   deliverable d
join   team t
on     d.team = t.id
order by d.keyResult,
         t.name;
       
-- used in /keyresults
create or replace view keyResultsConcat as 
select kr.id,
       kr.companyGoal,
       kr.objective,
       kr.name,
       kr.capitalisable,
       kr.jiraKR,
       kr.risks,
       kr.docLink,
       lu.rag,
       lu.completionHorizon,
       hh.horizonHistory,
       lu.status,
       lu.commentary,
       kr.committed,
       kr.quarter,
       o.organisation,
       group_concat(distinct(kru.id) order by kru.id desc) keyResultUpdates,
       group_concat(distinct(d.id)  order by d.id)         deliverables,
       group_concat(distinct(d.team))                      teams
from   keyResult kr
left join     keyResultUpdate kru
on    kr.id   = kru.keyResult
and   ifnull(kru.archived, false) = false
left join     deliverable d
on    kr.id   = d.keyResult
and  ifnull(d.archived, false) = false
left join     latestKeyResultUpdates lu
on    kr.id   = lu.keyResult
left join     horizonHistory hh
on    kr.id   = hh.keyResult
join          objective o
on    kr.objective = o.id
where  ifnull(kr.archived, false) = false
group by kr.id
order by kr.quarter, kr.objective desc
;

-- latest update per deliverable - used in /deliverables
create or replace view latestDeliverableUpdates as
select du.deliverable,
       du.status,
       du.commentary,
       du.updateDate,
       du.countryFlag,
       du.deliveryDate,
       du.teamFlag
from   deliverableUpdate du
where  du.id in ( select max(id) 
                  from deliverableUpdate 
                  where  ifnull(archived, false) = false
                  group by deliverable ) 
and    ifnull(du.archived, false) = false
order by du.deliverable
;

-- used in /deliverables
create or replace view deliverablesConcat as
select d.id,
       d.name,
       d.keyResult,
       d.description,
       lu.status,
       lu.commentary,
       lu.updateDate,
       d.jiraRoadmapItem,
       d.team,
       d.priority,
       lu.countryFlag,
       lu.teamFlag,
       lu.deliveryDate,
       d.statusChangeDate,
       kr.quarter,
       o.organisation,
       group_concat(distinct(du.id) order by du.id desc) deliverableUpdates
from   deliverable d
left join     deliverableUpdate du
on    d.id = du.deliverable
and   ifnull(du.archived, false) = false
left join     latestDeliverableUpdates lu
on    d.id   = lu.deliverable
join keyResult kr
on   kr.id    = d.keyResult
join objective o 
on   o.id     = kr.objective
where  ifnull(d.archived, false) = false
group by d.id
order by d.team, d.priority
;

create or replace view userOrganisation as
select u.id, 
       u.name,
       u.email, 
       u.token,
       u.givenName, 
       u.surname, 
       u.organisation, 
       o.name organisationName, 
       u.role, 
       u.team, 
       u.tokenExp, 
       u.lastVersionUpdate 
from   user         u
left join   organisation o
on     u.organisation = o.id;
