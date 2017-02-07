#!/bin/bash
mysql.server start &&
SHOULD_INSTALL=$1
if [ -n "$SHOULD_INSTALL" ]; then
    echo recreating database from schema &&
    sleep 2 &&
    mysql -uroot -e "SOURCE ./schema" &&

    echo running mvn clean install &&
    mvn clean install
fi
cd client &&
npm run build &&
cd ../ &&
cp -R ./client/target/ src/main/resources &&
mvn compile && mvn exec:java -Dexec.mainClass="example.JAX_RS_Entry" &&
mysql.server stop
