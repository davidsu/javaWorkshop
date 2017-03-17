package example;

import org.w3c.dom.Document;

import javax.ws.rs.*;

/**
 * Created by davidsu on 13/03/2017.
 */
@Path("/tasks")
public class Tasks {
    //todo return proper errors to client when failing
    //todo which columns must be 'not null' in tasks table?
    @GET
    public String getTasks() {
        try {
            Document doc = JDBC.getTasks();
            return Utils.DocumentToString(doc);
        } catch (Exception e) {
            System.out.println("exception in getTasks");
            e.printStackTrace();
        }
        return null;
    }

    @GET
    @Path("/newTaskMetadata")
    public String getNewTaskMetadata(@PathParam("id") String id){
        try {
            Document doc = JDBC.getTaskMetadata();
            return Utils.DocumentToString(doc);
        } catch (Exception e) {
            System.out.println("exception in getUsers");
            e.printStackTrace();
        }
        return null;
    }

    @GET
    @Path("/{id : [0-9]+}")
    public String getTaskById(@PathParam("id") String id){
        try {
            Document doc = JDBC.getTask(id);
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
    public String updateTask(String incomingXML){
        try {
            Document doc = Utils.createDocumentFromString(incomingXML);
            JDBC.createOrUpdateTask(doc);
        } catch (Exception e) {
            System.out.println("exception in tasks/createOrUpdate");
            e.printStackTrace();
        }
        return null;
    }
}
