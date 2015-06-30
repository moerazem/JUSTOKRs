insert into organisation (id, name) values (1, 'Test Organisation');

INSERT INTO role VALUES (1,'User'),(2,'Technology Manager'),(3,'Programme Manager');

insert into user (name, givenName, surname, email, organisation, role, token, tokenExp, lastVersionUpdate)
values ('Test User', 'Test', 'User', 'test.user@company.com', 1, 3, 'abcd', '2015-12-31', 0);

-- need a quarter
