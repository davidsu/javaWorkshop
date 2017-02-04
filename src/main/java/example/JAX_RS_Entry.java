package example;
import com.sun.jersey.api.core.PackagesResourceConfig;
import com.sun.jersey.api.core.ResourceConfig;
import com.sun.net.httpserver.HttpServer;
import com.sun.jersey.api.container.httpserver.HttpServerFactory;

import java.io.*;
import java.net.URL;

import javax.ws.rs.GET;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;

/**
 * Created by davidsu on 01/02/2017.
 */
// The Java class will be hosted at the URI path "/helloworld"
@Path("/")
public class JAX_RS_Entry {
    // The Java method will process HTTP GET requests
    @GET
    // The Java method will produce content identified by the MIME Media type "text/plain"
    @Produces({MediaType.TEXT_HTML})
    public InputStream getIndexHtml() {
        return getStaticFile("index.html");
    }

    @GET
    @Path("/static/{fileName : .+?(html|js|css)}")
    public InputStream getStaticFile(@PathParam("fileName") String fileName) {
        System.out.println("../" + fileName + ".html");
        URL url = getClass().getResource("../" + fileName);
        File file = new File(url.getPath());
        try {
            return new FileInputStream(file);
        } catch (FileNotFoundException e) {
            System.out.println("exception");
            e.printStackTrace();
        }
        return null;

    }

    public static void main(String[] args) throws IOException {
        ResourceConfig rc = new PackagesResourceConfig("example");
        HttpServer server = HttpServerFactory.create("http://localhost:9998/", rc);
        server.start();

        System.out.println("Server running");
        System.out.println("Visit: http://localhost:9998/helloworld");
        System.out.println("Hit return to stop...");
        System.in.read();
        System.out.println("Stopping server");
        server.stop(0);
        System.out.println("Server stopped");
    }
}
