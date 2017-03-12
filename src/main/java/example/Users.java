package example;

import org.w3c.dom.Document;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

/**
 * Created by davidsu on 06/03/2017.
 */
@Path("/users")
public class Users {
    @GET
    public String getUsers() {
        System.out.println("this is the new getUsers");
        try {
            Document doc = JDBC.getInstance().getUsers();
            return JDBC.toString(doc);
        } catch (Exception e) {
            System.out.println("exception in getUsers");
            e.printStackTrace();
        }
        return null;
    }

    @POST
    @Path("/create")
    @Consumes("application/xml")
    public String createUser(String incomingXML){
        //todo add this user to the database
        System.out.println("/users/create");
        System.out.println(incomingXML);
        return incomingXML;
    }

    @GET
    @Path("/boo")
    public String boo() {
        System.out.println("this is the new getUsers");
        return "hey look at me :)";
    }
}
