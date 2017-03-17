package example;

import org.w3c.dom.Document;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

/**
 * Created by davidsu on 06/03/2017.
 */
@Path("/users")
public class Users {
    //todo shouldn't type be enum?
    @GET
    @Secured
    @RolesAllowed("admin")
    public Response getUsers(@Context SecurityContext securityContext) {
        try {
            Document doc = JDBC.getUsers();
            return Response.ok(Utils.DocumentToString(doc)).build();
        } catch (Exception e) {
            System.out.println("exception in getUsers");
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }

    @POST
    @Path("/createOrUpdate")
    @Consumes("application/xml")
    @Secured
    @RolesAllowed("admin")
    //todo return proper errors to client when failing
    public void createOrUpdate(String incomingXML) {
        new Thread(() -> {
            try {
                Document doc = Utils.createDocumentFromString(incomingXML);
                JDBC.createOrUpdateUser(doc);
            } catch (Exception e) {
            }
        }).start();

    }

    @GET
    @Path("/boo")
    public String boo() throws InterruptedException {
        Thread.sleep(3000);
        System.out.println("this is the new getUsers");
        return "hey look at me :)\n";
    }
}
