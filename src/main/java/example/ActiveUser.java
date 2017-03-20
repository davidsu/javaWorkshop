package example;

import java.util.Calendar;

/**
 * Created by davidsu on 17/03/2017.
 */
public class ActiveUser {
    private boolean _isAdmin;
    private Calendar expirationDate;
    private String email;
    private int type;
    public ActiveUser(String email, int type){
        this.email = email;
        this.refreshExpirationDate();
        this.type = type;

    }
    public boolean isAdmin(){
        return type == 1;
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
