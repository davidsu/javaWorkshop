# Full Stack Task Manager
manage tasks lifecycle: assignement, execution, qa...

## Dependencies
* [maven](https://maven.apache.org/download.cgi)
* [node version 7](https://nodejs.org/en/download/) (version 6 probably works the same)
* npm - installed by default with node
* [mysql](https://maven.apache.org/download.cgi) - must be installed in such a way that allows for connection with the server without a password, by running `mysql -uroot`

## How to run
the following explanations are applicable for Mac OSX. They likely work without any modifications on most UNIX systems. <br>
If you need to run it on windows: <br>
In this scenario please read the code contained in build.sh and run their equivalent for a windows cmdline.<br>
Windows should probably have by now a support for bash, it's a simple script and likely to work if indeed there is such a support on windows.<br>
Else you may try running the sh script through [git bash](https://git-for-windows.github.io/), it might just work.


### for mac users
if you need to download any of the dependencies the advisable way of doing it is through [homebrew](https://brew.sh/)
once installed you may run
```sh
    brew install maven
    brew install node
    brew install mysql
    #if you don't have git than you may want to install it as well
    brew install git
```
download this project and cd into it's root directory
```sh
    git clone https://github.com/sudavid4/javaWorkshop.git
    cd javaWorkshop
```
you may now run the build script and open your browser in the url `localhost:9998`
```sh
    ./build.sh 1
    open http://localhost:9998
```

### What just happened
1. sqlserver was started if it wasn't already running
2. database named 'java_workshop' has been created (or recreated if it already existed) by sourcing './schema.sql'
3. all maven dependencies have been downloaded by running `mvn clean install`
4. all javascript dependencies have been downloaded by running `cd client; npm i; cd ../`
5. client side code have been compiled and copied to resources folder `src/main/resources`
6. java code has been compiled by running `mvn compile`
7. java server got up and running by running `mvn exec:java -Dexec.mainClass="Server.Main"`
8. You should now be able to interact with the program by browsing to `http://localhost:9998`



### Resources
[initial specs file](https://docs.google.com/document/d/1R6Ug87oJscQ7fA0fw_LfXq90quj-QVgwCN1T3MKQ7FA/edit)
[Program functionality file](https://docs.google.com/document/d/153SUs22-XVdvB4vqe8dW5so5oXgFDS-ecwxDQaL23t0/edit)
[System architecture file](https://docs.google.com/document/d/1qE9lefUQwB58AUssr5YL_uT2vp7hU8sorGmTDJF8qJU/edit)
