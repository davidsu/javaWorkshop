package example;
import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.eclipse.jetty.server.Server;
import org.glassfish.jersey.jetty.JettyHttpContainerFactory;
import org.glassfish.jersey.server.ResourceConfig;

//todo need to implement proper logging capabilities. see http://www.vogella.com/tutorials/Logging/article.html
//todo need to implement loginStuff and userValidation for every request

public class JAX_RS_Entry {

    public static void main(String[] args) {

        URI baseUri = UriBuilder.fromUri("http://localhost/").port(9998).build();
        ResourceConfig config = new ResourceConfig(ReceiveClientRequests.class, Users.class, Tasks.class);
        Server server = JettyHttpContainerFactory.createServer(baseUri, config);
//        Task task = new Task(1, 2, 2, 1, 3, "11/03/2017", null, "New", true, true, false,"just a test");
//        try {
//            JDBC.getInstance().saveTask(task);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
        System.out.println("Server running");
        System.out.println("Visit: http://localhost:9998");
    }
}

