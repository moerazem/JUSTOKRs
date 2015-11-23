-- NB. when doing an upgrade ensure that the following are done as well:
-- change version in api/api.js to version name e.g 1.4.1
-- change latestVersion in api/common.js to version ID (from versionUpdate e.g 6)
-- change version in package.json to version name e.g. 1.4.1

insert into versionUpdate 
(id, name, description, releaseDate) 
values
( 18, 
  'Version 1.7.7',
  "",
  '2015-11-23');

alter table user add password varchar(100) not null;

-- reload views: userOrganisation

-- set all user tokens as expired to force their browsers to re-login and pull the latest version of the app
update user set tokenExp = date_sub(now(), interval 1 day) where tokenExp > now();
