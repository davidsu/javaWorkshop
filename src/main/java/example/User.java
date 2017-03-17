package example;

import java.util.Calendar;

/**
 * Created by davidsu on 17/03/2017.
 */
public class User{
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
