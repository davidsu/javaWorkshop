package example;

/**
 * Created by davidsu on 17/03/2017.
 */
import java.security.SecureRandom;
import java.math.BigInteger;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

public final class SessionIdentifierGenerator {
    //todo implement the whole thing - add active user on login, provide a logout, verify active user upon request...
    private static SecureRandom random = new SecureRandom();
    private class User{
        private boolean _isAdmin;
        private Calendar expirationDate;
        private String email;
        public User(String email, boolean isAdmin){
            this.email = email;
            this.refreshExpirationDate();
            this._isAdmin = isAdmin;

        }
        public boolean isAdmin(){
            return _isAdmin;
        }
        public boolean isExpired(){
            return expirationDate.compareTo(Calendar.getInstance()) > 0;
        }
        public void refreshExpirationDate(){
            this.expirationDate = Calendar.getInstance();
            expirationDate.set(Calendar.MINUTE, expirationDate.get(Calendar.MINUTE) + 5);
        }
    }
    private static HashMap<Integer, User> activeUsers = new HashMap<>();

    public static String nextSessionId() {
        //todo certify that return value isn't present in "activeUsers"
        return new BigInteger(130, random).toString(32);
    }
}
