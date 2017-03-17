package example;

import org.glassfish.jersey.server.ManagedAsync;
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
    //todo return proper errors to client when failing
    //todo shouldn't type be enum?
    @GET
    public String getUsers() {
        System.out.println("this is the new getUsers");
        try {
            Document doc = JDBC.getUsers();
            return Utils.DocumentToString(doc);
        } catch (Exception e) {
            System.out.println("exception in getUsers");
            e.printStackTrace();
        }
        return null;
    }

    @POST
    @Path("/createOrUpdate")
    @Consumes("application/xml")
    public void createUser(String incomingXML){
        //todo make this createOrUpdate instead of createOnly
        new Thread(() -> {
            try{
                Document doc = Utils.createDocumentFromString(incomingXML);
                JDBC.createOrUpdateUser(doc);
            }catch(Exception e){}
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
