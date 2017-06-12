package Server;
import java.io.File;
import java.io.IOException;
import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import Server.Requests.*;
import Server.Security.SessionHandler;
import org.eclipse.jetty.server.Server;
import org.glassfish.jersey.jetty.JettyHttpContainerFactory;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;

import java.util.logging.Logger;
public class Main {

    public static void main(String[] args) {

        // if the directory does not exist, create it
        createUploadedFilesDirectoryIfNeeded();
        Logger logger = initializeLogger();
        String uri = "http://localhost/";
        int port = 9998;
        URI baseUri = UriBuilder.fromUri(uri).port(port).build();
        logger.info("*** Starting Web Server ***");
        logger.info(String.format("Server URL is - %1s port: %2s", uri, port));
        ResourceConfig config =
                new ResourceConfig(
                        ReceiveClientRequests.class,
                        Users.class,
                        Tasks.class,
                        Login.class,
                        SessionHandler.class,
                        RolesAllowedDynamicFeature.class,
                        FileHandler.class
                );
        config.register(MultiPartFeature.class);
        SessionHandler.init();
        //Note - user testuser created in this init. curl should take the following form
        //curl -H "Authorization: Bearer testuser" http://localhost:9998/users

        Server server = JettyHttpContainerFactory.createServer(baseUri, config);
        logger.info("***** Server status is UP *****");
        System.out.println("Server running");
        System.out.println("Visit: http://localhost:9998");
    }

    private static Logger initializeLogger() {
        try {
            LogHandler.setup();
        } catch (IOException e) {
            System.out.println("Failed to create the log file!");
            e.printStackTrace();
            System.exit(1);
        }
        return Logger.getLogger("javaWorkshop");
    }

    private static void createUploadedFilesDirectoryIfNeeded() {
        File theDir = new File(Constants.UPLOAD_DIR);
        if (!theDir.exists()) {
            System.out.println("creating directory: " + theDir.getName());
            try{
                theDir.mkdir();
            }
            catch(SecurityException se){
                System.out.println("Security exception on trying to create folder " + Constants.UPLOAD_DIR + ". Terminating!");
                System.exit(1);
            }
        }
    }
}

