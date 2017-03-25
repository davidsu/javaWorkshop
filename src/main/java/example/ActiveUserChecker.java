package example;

/**
 * Created by Alon on 25/03/2017.
 */
public class ActiveUserChecker extends Thread
{
    private static Integer cycleTime = 60000;
    @Override
    public void run()
    {
        while(true) {
            SessionHandler.removeExpiredUsers();
            try {
                Thread.sleep(cycleTime);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}
