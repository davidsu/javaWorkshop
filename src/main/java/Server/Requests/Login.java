package Server.Requests;


import Server.Security.ActiveUser;
import Server.Database.JDBC;
import Server.Security.SessionHandler;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.logging.Logger;


/*
    Class for handling login requests
 */
@Path("/login")
public class Login {

    private static Logger logger = Logger.getLogger("javaWorkshop");
    private static HashMap<Integer, String> userTypesDict = new HashMap<Integer, String>();
    private ActiveUser authenticate(String user, String password)
    {
        int userType;
        ActiveUser aUser = null;
        try
        {
            userType = JDBC.getUserType(user, password);
            aUser = (userType != 0) ? new ActiveUser(user, userType): null;
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return aUser;
    }
    @GET
    public Response login(@QueryParam("user") String user, @QueryParam("password") String password){
        System.out.println("user: " + user);
        System.out.println("password: " + password);
        if(userTypesDict.isEmpty())
        {
            try {
                JDBC.StaticTableToDict("UserTypes", userTypesDict, 1, 2);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        ActiveUser aUser =  authenticate(user, password);
        if(aUser != null){
            String userType = userTypesDict.get(aUser.getType());
            String token = SessionHandler.generateToken(userType);
            SessionHandler.addActiveUser(token, aUser);
            logger.info(String.format("User - %1s has logged in", user));
            return Response.ok(token).build();
        } else {
            logger.warning(String.format("User - %1s failed to login (unauthorized)", user));
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }
}
