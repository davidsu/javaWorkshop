package example;

import org.w3c.dom.Document;
import javax.ws.rs.*;
import javax.annotation.security.RolesAllowed;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

/**
 * Created by davidsu on 06/03/2017.
 */
@Path("/users")
public class Users {
    private static Logger logger = Logger.getLogger("javaWorkshop");
    //todo shouldn't type be enum?
    @GET
    @Secured
    @RolesAllowed("admin")
    public Response getUsers() {
        try {
            Document doc = JDBC.getUsers();
            logger.info("Returning all users details");
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
                String email = Utils.getElementValueFromDoc(doc, "email");
                logger.info(String.format("Updating/adding user = '%1s'", email));
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
            if(!Utils.isNumeric(id))
            {
                return Response.status(Response.Status.BAD_REQUEST)
                        .type("text/plain")
                        .entity("Invalid user ID")
                        .build();
            }
            Document doc = JDBC.getUser(id);
            return Response.ok(Utils.DocumentToString(doc, true)).build();
        } catch (Exception e) {
            System.out.println("exception in getUsers");
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GET
    @Secured
    @Path("/newUserMetadata")
    public Response getNewUserMetadata(){
        try {
            Document doc = JDBC.getUserMetadata();
            return Response.ok(Utils.DocumentToString(doc)).build();
        } catch (Exception e) {
            System.out.println("exception in getUsers");
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GET
    @Secured
    @Path("/logoutUser")
    public Response logoutUser(@PathParam("token") String token)
    {
        logger.info(String.format("Logging out user (token: '%1s'", token));
        if(SessionHandler.removeUser(token))
        {
            return Response.ok().build();
        }
        return Response.status(Response.Status.BAD_REQUEST)
                .type("text/plain")
                .entity(String.format("Couldn't logout user's session (token: '%1s')", token))
                .build();
    }

}
