#! /bin/sh
# we need a bunch of Ember files to be very different between Ember Simple Auth and ADFS so this script creates hard links so that the appropriate files 
# are set based on the auth method set in $OKR_AUTH_METHOD

if [ -z "$1" ]; 
then
  echo "Please specify which authentication method to use - valid values are ADFS or ESA - see README.md"
else
  #remove old hard links
  rm -f app/controllers/login.js
  rm -f app/routes/login.js
  rm -f app/routes/application.js
  rm -f app/templates/login.hbs
  rm -rf tmp/*

  export OKR_AUTH_METHOD=$1
  echo $OKR_AUTH_METHOD set

  if [ "$OKR_AUTH_METHOD" == "ADFS" ];
  then
    ln aauthentication/controllers/login.adfs.js app/controllers/login.js
    ln authentication/routes/login.adfs.js app/routes/login.js
    ln authentication/routes/application.adfs.js app/routes/application.js
  else
    ln authentication/controllers/login.esa.js app/controllers/login.js
    ln authentication/routes/login.esa.js app/routes/login.js
    ln authentication/routes/application.esa.js app/routes/application.js
    ln authentication/templates/login.esa.hbs app/templates/login.hbs
  fi
fi
