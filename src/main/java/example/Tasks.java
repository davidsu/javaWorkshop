package example;

import org.w3c.dom.Document;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

/**
 * Created by davidsu on 13/03/2017.
 */
@Path("/tasks")
public class Tasks {
    @GET
    public String getTasks() {
        try {
            Document doc = JDBC.getInstance().getTasks();
            return Utils.DocumentToString(doc);
        } catch (Exception e) {
            System.out.println("exception in getUsers");
            e.printStackTrace();
        }
        return null;
    }
}
