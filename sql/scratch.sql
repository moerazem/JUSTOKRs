-- {{{ play with logs
bunyan -c 'this.audit == true' -o short log/okr.log*
bunyan -c 'this.audit == true && this.entity="deliverable"' -o short log/okr.log*
bunyan -c 'this.entity == "keyResult" && this.audit == true && this.id == 128' -o short log/okr.log*
-- }}}

-- {{{ unarchive all records 
update quarter set archived = null;
update objective set archived = null;
update keyResult set archived = null;
update team set archived = null;
update teamKeyResult set archived = null;
update keyResultUpdate set archived = null;
update roadmapItem set archived = null;
update roadmapItemUpdate set archived = null;
-- }}}
-- {{{ show archived counts
select "Quarter" as title;
select archived, count(*) from quarter group by archived;
select "Objective" as title;
select archived, count(*) from objective group by archived;
select "KeyResult" as title;
select archived, count(*) from keyResult group by archived;
select "Team" as title;
select archived, count(*) from team group by archived;
select "KeyResultUpdate" as title;
select archived, count(*) from keyResultUpdate group by archived;
select "RoadmapItem" as title;
select archived, count(*) from roadmapItem group by archived;
select "RoadmapItemUpdate" as title;
select archived, count(*) from roadmapItemUpdate group by archived;
-- }}}

-- {{{ org KRs 
select         o.id                o_id,
               o.name              o_name,
               kr.id               kr_id,
               kr.name             kr_name
from           keyResult           kr
join           objective           o
on             kr.objective        =      o.id
and            o.organisation      =      2
and            ifnull(o.archived,  false) = false
where          ifnull(kr.archived, false) = false;
-- }}}
