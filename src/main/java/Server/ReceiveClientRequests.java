package Server;

import java.io.*;
import java.net.URL;

import javax.ws.rs.GET;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Created by davidsu on 01/02/2017.
 */
@Path("/")
public class ReceiveClientRequests {
    @GET
    @Produces({MediaType.TEXT_HTML})
    public Response getIndexHtml() {
        return getStaticFile("index.html");
    }

    @GET
    @Path("/static/{fileName : (.+/?)+(html|js|css|map)}")
    public Response getStaticFile(@PathParam("fileName") String fileName) {
        try {
            System.out.println("../" + fileName);
            URL url = getClass().getResource("../" + fileName);
            File file = new File(url.getPath());
            return Response.ok(new FileInputStream(file)).build();
        } catch (Exception e) {
            System.out.println("exception");
            e.printStackTrace();
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

}