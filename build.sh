#!/bin/bash
set -e
mysql -uroot -e status || mysql.server start
SHOULD_INSTALL=$1
if [ -n "$SHOULD_INSTALL" ]; then
    echo recreating database from schema
    sleep 2 &&
    mysql -uroot -e "SOURCE ./schema.sql"

    echo running mvn clean install
    mvn clean install

    echo running npm install
    cd client
    npm i
    cd ../
fi
cd client
npm run build
cd ../
cp -R ./client/target/ src/main/resources
mvn compile && mvn exec:java -Dexec.mainClass="Server.JAX_RS_Entry"
