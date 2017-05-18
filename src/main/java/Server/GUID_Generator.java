package Server;

import java.math.BigInteger;
import java.security.SecureRandom;

public class GUID_Generator {
    private static SecureRandom random = new SecureRandom();public static String generateGuid() {
        return new BigInteger(130, random).toString(32);
    }
}
