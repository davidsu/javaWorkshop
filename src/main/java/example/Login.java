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
    @GET
    public Response login(@QueryParam("user") String user, @QueryParam("password") String password){
        System.out.println("user: " + user);
        System.out.println("password: " + password);
        return Response.ok(SessionIdentifierGenerator.nextSessionId()).build();
    }
}
