package Server;

import javax.annotation.Priority;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.*;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.security.SecureRandom;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


/*
    Class for handling sessions
 */
@Secured
@Provider
@Priority(Priorities.AUTHENTICATION)
//http://stackoverflow.com/questions/26777083/best-practice-for-rest-token-based-authentication-with-jax-rs-and-jersey
public class SessionHandler implements ContainerRequestFilter {
    //todo implement the whole thing - add active user on login, provide a logout, verify active user upon request...

    private static HashMap<String, ActiveUser> activeUsers = new HashMap<>();
    private static SecureRandom random = new SecureRandom();
    private static Object locker = new Object();

    public static void init(){
        Thread userChecker = new ActiveUserChecker();
        userChecker.start();
        activeUsers.put("testuser", new ActiveUser("dummy@email", 1));
        activeUsers.put("testuser1", new ActiveUser("a@b.com", 2));
    }

    public static void addActiveUser(String token, ActiveUser user){
        synchronized (locker)
        {
            activeUsers.put(token, user);
        }
    }

    public static String generateToken(String userType) {
        String sessionId = new BigInteger(130, random).toString(32);
        String token = userType + "_" + sessionId;
        if(activeUsers.containsKey(token))
        {
            generateToken(userType);
        }
        return token;
    }

    public static void removeExpiredUsers()
    {
        Iterator<Map.Entry<String,ActiveUser>> iter = activeUsers.entrySet().iterator();
        synchronized (locker) {
            while (iter.hasNext()) {
                Map.Entry<String, ActiveUser> entry = iter.next();
                ActiveUser user = entry.getValue();
                if (user.isExpired()) {

                    iter.remove();

                }
            }
        }
    }

    public static boolean removeUser(String token)
    {
        if(activeUsers.containsKey(token))
        {
            synchronized (locker)
            {
                activeUsers.remove(token);
                return true;
            }
        }
        return false;
    }

    private ActiveUser getActiveUserForToken(String token){
        ActiveUser user = activeUsers.get(token);
        if(user == null || user.isExpired()){
            return user;
        }
        user.refreshExpirationDate();
        return user;
    }

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Get the HTTP Authorization header from the request
        String authorizationHeader =
                requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        // Check if the HTTP Authorization header is present and formatted correctly
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new NotAuthorizedException("Authorization header must be provided");
        }

        // Extract the token from the HTTP Authorization header
        String token = authorizationHeader.substring("Bearer".length()).trim();
        ActiveUser user = getActiveUserForToken(token);

        if(user == null){
            requestContext.abortWith(
                    Response.status(Response.Status.UNAUTHORIZED)
                            .build());
        }else if(user.isExpired()){
            requestContext.abortWith(
                    Response.status(Response.Status.UNAUTHORIZED)
                            .entity("Your session has expired. Please Log In again.")
                            .build());
        }
        requestContext.setSecurityContext(new InternalSecurityContext(user));
    }
}
