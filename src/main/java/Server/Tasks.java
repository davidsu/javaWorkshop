package Server;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.w3c.dom.Document;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.logging.Logger;

/*
    Class for handling Task requests
 */
@Path("/tasks")
public class Tasks {
    //todo return proper errors to client when failing - should we show the client a different screen if the filter is bad? currently we ignore invalid values in the filter.

    private static Logger logger = Logger.getLogger("javaWorkshop");
    @GET
    @Secured
    //@Path("/filteredTasks")
    public Response getFilteredTasks(@QueryParam("id") String id,
                                   @QueryParam("status") String status,
                                   @QueryParam("taskType") String type,
                                   @QueryParam("open_date") String openDate,
                                   @QueryParam("exec_date") String execDate,
                                   @QueryParam("page") Integer page) {
        System.out.println("status = " + status);
        System.out.println("type = " + type);
        System.out.println("page = " + page);
        try {
            if (!Utils.checkIds(id) || !Utils.checkDates(openDate) || ! Utils.checkDates(execDate))
            {
                return Response.status(Response.Status.BAD_REQUEST)
                        .type("text/plain")
                        .entity("Invalid Task filter params")
                        .build();
            }
            String filter = buildTaskFilter(id, status, type, openDate, execDate);
            String msg = filter == "" ? String.format("All tasks were requested with page = %1s", page) : String.format("Tasks were requested with filter: '%1s' and page = %2s", filter, page);
            logger.info(msg);
            Document doc = JDBC.getFilteredTasks(filter, page);
            return Response.ok(Utils.DocumentToString(doc, true)).build();
        } catch (Exception e) {
            logger.severe(String.format("Error in getFilteredTasks : %1s", e));
            return Utils.generateError(e);
        }
    }

    private String buildTaskFilter(String id, String status, String type, String openDate, String execDate) {
        ArrayList<String> filterArr = new ArrayList<>();
        filterArr.add(Utils.buildIdFilter(id));
        filterArr.add(Utils.buildFilter(status, "status"));
        filterArr.add(Utils.buildFilter(type, "taskType"));
        filterArr.add(Utils.buildDatesFilter(openDate, "open_date"));
        filterArr.add(Utils.buildDatesFilter(execDate, "exec_date"));
        filterArr.removeAll(Collections.singleton(null));
        String filter = String.join(" and ", filterArr);
        return filter.length() > 0 ? " where " + filter : "";
    }

    @GET
    @Secured
    @Path("/newTaskMetadata")
    public Response getNewTaskMetadata(){
        try {
            Document doc = JDBC.getTaskMetadata();
            logger.info("Handled request for Task Metadata");
            return Response.ok(Utils.DocumentToString(doc)).build();
        } catch (Exception e) {
            logger.severe(String.format("Error in getNewTaskMetadata : %1s", e));
            return Utils.generateError(e);
        }
    }

    @GET
    @Secured
    @Path("/{id : [0-9]+}")
    public Response getTaskById(@PathParam("id") String id){
        try {
            if(!Utils.isNumeric(id))
            {
                return Response.status(Response.Status.BAD_REQUEST)
                    .type("text/plain")
                    .entity("Invalid Task ID")
                    .build();
            }
            Document doc = JDBC.getTask(id);
            logger.info(String.format("Returning details of task ID = %1s", id));
            return Response.ok(Utils.DocumentToString(doc)).build();
        } catch (Exception e) {
            logger.severe(String.format("Error in getTaskById : %1s", e));
            return Utils.generateError(e);
        }
    }

    //todo when adding a new task, the exec time is missing! (fails to add it) + we have to inforce values on mandatory fields getting a lot of failures because of missing values
    @POST
    @Secured
    @Path("/createOrUpdate")
    @Consumes("application/xml")
    public Response createOrUpdate(String incomingXML){
        try {
            Document doc = Utils.createDocumentFromString(incomingXML);
            String id = Utils.getElementValueFromDoc(doc, "id");
            JDBC.createOrUpdateTask(doc);
            String msg = id != null ? String.format("Updating task ID = %1s", id) : "Adding a new task";
            logger.info(msg);
            return Response.ok().build();
        } catch (Exception e) {
            logger.severe(String.format("Error in createOrUpdate : %1s", e));
            return Utils.generateError(e);
        }
    }

    //todo should we do something to prevent multiple actions on the same task ? (relevant also on multiple updates) - return proper error to indicate that the id doesn't exist
    @GET
    @Secured
    @Path("/deleteTask")
    public Response deleteTask(@PathParam("id") String id)
    {
        if(!Utils.isNumeric(id))
        {
            return Response.status(Response.Status.BAD_REQUEST)
                    .type("text/plain")
                    .entity("Invalid Task ID")
                    .build();
        }
        logger.info(String.format("Deleting Task id = %1s", id));
        try {
            JDBC.deleteTask(id);
            return Response.ok().build();
        } catch (Exception e) {
            logger.severe(String.format("Failed to delete task id = %1s. Error: %2s", id, e.getMessage()));
            return Utils.generateError(e);
        }
    }
}
