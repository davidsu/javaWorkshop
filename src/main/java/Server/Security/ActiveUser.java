package Server.Security;

import Server.Constants;

import javax.ws.rs.core.SecurityContext;
import java.security.Principal;
import java.util.Calendar;

/*
    Class for active user info
 */
public class ActiveUser implements SecurityContext, Principal {
    private Calendar expirationDate;
    private String email;
    private int type;
    private static Integer sessionTime = 2;
    public ActiveUser(String email, int type){
        this.email = email;
        this.refreshExpirationDate();
        this.type = type;
    }

    public boolean isExpired(){
        if(this.email.equals("dummy@email"))
            return false;
        return Calendar.getInstance().compareTo(expirationDate) > 0;
    }

    public int getType()
    {
        return type;
    }

    public void refreshExpirationDate(){
        this.expirationDate = Calendar.getInstance();
        expirationDate.set(Calendar.MINUTE, expirationDate.get(Calendar.MINUTE) + sessionTime);
    }

    @Override
    public String getName() {
        return this.type == Constants.USER_TYPE_ADMIN ? "admin" : "user";
    }
    @Override
    public Principal getUserPrincipal() {
        return this;
    }

    @Override
    public boolean isUserInRole(String s) {
        return s != null && s.equals(this.getName());
    }

    @Override
    public boolean isSecure() {
        return true;
    }

    @Override
    public String getAuthenticationScheme() {
        return null;
    }


}
