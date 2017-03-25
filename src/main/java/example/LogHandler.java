package example;
import java.util.logging.FileHandler;
import java.util.logging.SimpleFormatter;
import java.io.IOException;
import java.util.logging.Logger;
import java.util.logging.Level;
/**
 * Created by Alon on 25/03/2017.
 */
public class LogHandler
{
    static private FileHandler fileTxt;
    static private SimpleFormatter formatterTxt;

    static public void setup() throws IOException {

        // get the global logger to configure it
        Logger logger = Logger.getLogger("javaWorkshop");
        logger.setLevel(Level.INFO);
        fileTxt = new FileHandler("javaWorkshopLog.txt");
        // create a TXT formatter
        formatterTxt = new SimpleFormatter();
        fileTxt.setFormatter(formatterTxt);
        logger.addHandler(fileTxt);

    }
}
