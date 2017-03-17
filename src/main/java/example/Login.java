package example;


import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

/**
 * Created by davidsu on 17/03/2017.
 */
@Path("/login")
public class Login {
    private boolean authenticate(String user, String password){
        //todo see that value exist in dataBase
        return true;
    }
    @GET
    public Response login(@QueryParam("user") String user, @QueryParam("password") String password){
        System.out.println("user: " + user);
        System.out.println("password: " + password);
        if(authenticate(user, password)){
            //todo store token + user to manage sessions
            String token = SessionHandler.nextSessionId();
            return Response.ok(token).build();
        } else {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }
}
