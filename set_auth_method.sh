#! /bin/sh
# we need a bunch of Ember files to be very different between Ember Simple Auth and ADFS so this script creates hard links so that the appropriate files 
# are set based on the auth method set in $OKR_AUTH_METHOD
rm app/controllers/login.js
rm app/routes/login.js
rm app/routes/application.js
rm app/templates/login.js
if [ "$OKR_AUTH_METHOD" == "ADFS" ];
then
  echo "adfs"
  ln app/controllers/login.adfs.js app/controllers/login.js
  ln app/routes/login.adfs.js app/routes/login.js
  ln app/routes/application.adfs.js app/routes/application.js
else
  echo "esa"
  ln app/controllers/login.esa.js app/controllers/login.js
  ln app/routes/login.esa.js app/routes/login.js
  ln app/routes/application.esa.js app/routes/application.js
  ln app/templates/login.esa.js app/templates/login.js
fi
