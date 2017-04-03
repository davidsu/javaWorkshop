package example;

import javax.ws.rs.core.SecurityContext;
import java.security.Principal;

/*
    Security context for users
 */
public class InternalSecurityContext implements SecurityContext {
    private ActiveUser user;
    private Principal principal;
    public InternalSecurityContext(ActiveUser user){
        this.user = user;
        this.principal = () -> user.isAdmin() ? "admin" : "user";
    }
    @Override
    public Principal getUserPrincipal() {
        return this.principal;
    }

    @Override
    public boolean isUserInRole(String s) {
        return s != null && s.equals(principal.getName());
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
