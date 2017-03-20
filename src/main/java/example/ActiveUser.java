package example;

import java.util.Calendar;

/**
 * Created by davidsu on 17/03/2017.
 */
public class ActiveUser {
    private boolean _isAdmin;
    private Calendar expirationDate;
    private String email;
    public ActiveUser(String email, boolean isAdmin){
        this.email = email;
        this.refreshExpirationDate();
        this._isAdmin = isAdmin;

    }
    public boolean isAdmin(){
        return _isAdmin;
    }
    public boolean isExpired(){
        if(this.email.equals("dummy@email"))
            return false;
        return Calendar.getInstance().compareTo(expirationDate) > 0;
    }
    public void refreshExpirationDate(){
        this.expirationDate = Calendar.getInstance();
        expirationDate.set(Calendar.MINUTE, expirationDate.get(Calendar.MINUTE) + 15);
    }
}
