package example;

import org.w3c.dom.Document;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Collections;
import java.util.logging.Logger;

/**
 * Created by davidsu on 13/03/2017.
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
            String filter = buildTaskFilter(id, status, type, openDate, execDate);
            logger.info(String.format("Tasks were requested with filter: '%1s' and page = %2s", filter, page));
            Document doc = JDBC.getFilteredTasks(filter, page);
            return Response.ok(Utils.DocumentToString(doc, true)).build();
        } catch (Exception e) {
            logger.severe(String.format("Error in getFilteredTasks : %1s", e));
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
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
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
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
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }

    @POST
    @Secured
    @Path("/createOrUpdate")
    @Consumes("application/xml")
    public Response createOrUpdate(String incomingXML){
        try {
            Document doc = Utils.createDocumentFromString(incomingXML);
            JDBC.createOrUpdateTask(doc);
            return Response.ok().build();
        } catch (Exception e) {
            logger.severe(String.format("Error in createOrUpdate : %1s", e));
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }
}
