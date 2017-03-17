package example;

import org.w3c.dom.Document;

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
public class ReceiveClientRequests {
    //todo return proper errors to client when failing
    // The Java method will process HTTP GET requests
    @GET
    // The Java method will produce content identified by the MIME Media type "text/plain"
    @Produces({MediaType.TEXT_HTML})
    public InputStream getIndexHtml() {
        return getStaticFile("index.html");
    }

    @GET
    @Path("/static/{fileName : (.+/?)+(html|js|css|map)}")
    public InputStream getStaticFile(@PathParam("fileName") String fileName) {
        System.out.println("../" + fileName);
        URL url = getClass().getResource("../" + fileName);
        File file = new File(url.getPath());
        try {
            return new FileInputStream(file);
        } catch (FileNotFoundException e) {
            //todo send 404
            System.out.println("exception");
            e.printStackTrace();
        }
        return null;
    }

}