package example;
import java.io.IOException;
import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.eclipse.jetty.server.Server;
import org.glassfish.jersey.jetty.JettyHttpContainerFactory;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;

//todo need to implement proper logging capabilities. see http://www.vogella.com/tutorials/Logging/article.html
import java.util.logging.Logger;
public class JAX_RS_Entry {

    public static void main(String[] args) {

        try {
            LogHandler.setup();
        } catch (IOException e) {
            e.printStackTrace();
        }
        Logger logger = Logger.getLogger("javaWorkshop");
        String uri = "http://localhost/";
        int port = 9998;
        URI baseUri = UriBuilder.fromUri(uri).port(port).build();
        logger.info(String.format("Server URL is - %1s port: %2s", uri, port));
        ResourceConfig config =
                new ResourceConfig(
                        ReceiveClientRequests.class,
                        Users.class,
                        Tasks.class,
                        Login.class,
                        SessionHandler.class,
                        RolesAllowedDynamicFeature.class
                );
        //todo - (just a comment, nothing todo here) - note testuser created in this init. curl should take the following form
        //curl -H "Authorization: Bearer testuser" http://localhost:9998/users
        SessionHandler.init();
        Server server = JettyHttpContainerFactory.createServer(baseUri, config);
//        Task task = new Task(1, 2, 2, 1, 3, "11/03/2017", null, "New", true, true, false,"just a test");
//        try {
//            JDBC.getInstance().saveTask(task);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
        logger.info("***** Server status is UP *****");
        System.out.println("Server running");
        System.out.println("Visit: http://localhost:9998");
    }
}

