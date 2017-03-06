package example;

import org.w3c.dom.Document;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

/**
 * Created by davidsu on 06/03/2017.
 */
@Path("/users")
public class GetUsers {
    @GET
    public String getUsers() {
        System.out.println("this is the new getUsers");
        try {
            Document doc = JDBC.getInstance().getUsrs();
            return JDBC.toString(doc);
        } catch (Exception e) {
            System.out.println("exception in getUsers");
            e.printStackTrace();
        }
        return null;
    }

    @GET
    @Path("/boo")
    public String boo() {
        System.out.println("this is the new getUsers");
        return "hey look at me :)";
    }
}
