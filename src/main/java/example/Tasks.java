package example;

import org.w3c.dom.Document;

import javax.ws.rs.*;
import java.util.Date;
/**
 * Created by davidsu on 13/03/2017.
 */
@Path("/tasks")
public class Tasks {
    //todo return proper errors to client when failing
    //todo which columns must be 'not null' in tasks table?
//    @GET
//    @Secured
//    public String getTasks(@QueryParam("status") String status,
//                           @QueryParam("type") String type,
//                           @QueryParam("exec_date") String exec_date,
//                           @QueryParam("page") Integer page) {
//        System.out.println("status = " + status);
//        System.out.println("type = " + type);
//        System.out.println("exec_date = " + exec_date);
//        System.out.println("page = " + page);
//        try {
//            Document doc = JDBC.getTasks(page);
//            return Utils.DocumentToString(doc, true);
//        } catch (Exception e) {
//            System.out.println("exception in getTasks");
//            e.printStackTrace();
//        }
//        return null;
//    }

    @GET
    @Secured
    //@Path("/filteredTasks")
    public String getFilteredTasks(@QueryParam("status") String status,
                                   @QueryParam("taskType") String type,
                                   @QueryParam("open_date") String openDate,
                                   @QueryParam("exec_date") String execDate,
                                   @QueryParam("page") Integer page) {
        System.out.println("status = " + status);
        System.out.println("type = " + type);
        System.out.println("page = " + page);
        try {
            Document doc = JDBC.getFilteredTasks(status, type, openDate, execDate, page);
            return Utils.DocumentToString(doc, true);
        } catch (Exception e) {
            System.out.println("exception in getTasks");
            e.printStackTrace();
        }
        return null;
    }

    //todo - why do we use id in this method?
    @GET
    @Secured
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
    @Secured
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
    @Secured
    @Path("/createOrUpdate")
    @Consumes("application/xml")
    public String createOrUpdate(String incomingXML){
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
