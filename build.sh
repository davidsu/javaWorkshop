#!/bin/bash
cd client
grunt
cd ../
SHOULD_INSTALL=$1
if [ -n "$SHOULD_INSTALL" ]; then
    echo running mvn clean install
    mvn clean install
fi
mvn compile && mvn exec:java -Dexec.mainClass="example.JAX_RS_Entry"
