package example;

import org.w3c.dom.Document;
import javax.ws.rs.*;
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
    public Response getUsers() {
        try {
            Document doc = JDBC.getUsers();
            return Response.ok(Utils.DocumentToString(doc, true)).build();
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
    public Response createOrUpdate(String incomingXML) {
            try {
                Document doc = Utils.createDocumentFromString(incomingXML);
                JDBC.createOrUpdateUser(doc);
                return Response.ok().build();
            } catch (Exception e) {
                //todo: if we knew which kind of exception we could give a friendly error message
                e.printStackTrace();
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .type("text/plain")
                        .entity("//todo: if we knew which kind of exception we could give a friendly error message")
                        .build();
            }
    }

    @GET
    @Secured
    @Path("/{id : [0-9]+}")
    public Response getUserById(@PathParam("id") String id){
        try {
            Document doc = JDBC.getUser(id);
            return Response.ok(Utils.DocumentToString(doc, true)).build();
        } catch (Exception e) {
            System.out.println("exception in getUsers");
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GET
    @Path("/boo")
    public String boo() throws InterruptedException {
        Thread.sleep(3000);
        return "hey look at me :)\n";
    }
}
