package example;
import java.util.logging.FileHandler;
import java.util.logging.SimpleFormatter;
import java.io.IOException;
import java.util.logging.Logger;
import java.util.logging.Level;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Calendar;
/**
 * Created by Alon on 25/03/2017.
 */
public class LogHandler
{
    private static FileHandler fileTxt;
    private static SimpleFormatter formatterTxt;

    public static void setup() throws IOException {

        // get the global logger to configure it
        Logger logger = Logger.getLogger("javaWorkshop");
        logger.setLevel(Level.INFO);
        String logFullPath = getLogPath().toString() + "/javaWorkshopLog.txt";
        fileTxt = new FileHandler(logFullPath);
        // create a TXT formatter
        formatterTxt = new SimpleFormatter();
        fileTxt.setFormatter(formatterTxt);
        logger.addHandler(fileTxt);

    }

    private static Path getLogPath()
    {
        Integer year = Calendar.getInstance().get(Calendar.YEAR);
        Integer month = Calendar.getInstance().get(Calendar.MONTH);
        Integer day = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        Path logFolder = Paths.get("./logs/" + year.toString() + "/" + month.toString() + "/" + day.toString());
        if(Files.notExists(logFolder))
        {
            try {
                Files.createDirectories(logFolder);
            } catch (IOException e) {
                System.out.println("Failed to create log's folder");
                e.printStackTrace();
            }
        }
        return logFolder;

    }

}
