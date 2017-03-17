package example;

/**
 * Created by davidsu on 17/03/2017.
 */
import java.security.SecureRandom;
import java.math.BigInteger;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

public final class SessionHandler {
    //todo implement the whole thing - add active user on login, provide a logout, verify active user upon request...

    private static HashMap<String, User> activeUsers = new HashMap<>();
    private static SecureRandom random = new SecureRandom();

    public static void init(){
        activeUsers.put("testuser", new User("dummy@email", true));
    }


    public static String nextSessionId() {
        //todo certify that return value isn't present in "activeUsers"
        return new BigInteger(130, random).toString(32);
    }
}
