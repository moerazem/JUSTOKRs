#!/bin/bash
# stop & restart nginx
sudo nginx -s stop;
sleep 1;
sudo nginx;

# stop & restart API
forever stop /home/ec2-user/src/okr/api/api.js;
forever start -c "node --harmony" -a -m 5 -l okr.log -o okr_out.log -e okr_err.log --minUptime 5000 --spinSleepTime 2000 /home/ec2-user/src/okr/api/api.js;
