package example;

import com.mysql.cj.jdbc.result.ResultSetImpl;
import org.w3c.dom.Document;
import javax.xml.parsers.ParserConfigurationException;
import java.sql.*;
import java.text.SimpleDateFormat;

public class JDBC {
    private Connection conn;

    private static JDBC instance = null;
    public JDBC() throws ClassNotFoundException, IllegalAccessException, InstantiationException, SQLException {
        Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
        conn = DriverManager.getConnection("jdbc:mysql://localhost/java_workshop?autoReconnect=true&useSSL=false", "root", "");
    }

    public static JDBC getInstance() throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException {
        if(instance == null) {
            instance = new JDBC();
        }
        return instance;
    }

    public Document getUsers() throws SQLException, ParserConfigurationException {
        Statement stmt;
        ResultSet rs;
        stmt = conn.createStatement();
        rs = stmt.executeQuery("SELECT * FROM users");
        return Utils.createDocumentFromResultSet((ResultSetImpl) rs, "user");
    }

    public void addUser(Document doc) throws SQLException {
        String values = "";
        values += "'" + doc.getElementsByTagName("full_name").item(0).getTextContent() + "', ";
        values += "'" + doc.getElementsByTagName("type").item(0).getTextContent() + "' ,";
        values += "'" + doc.getElementsByTagName("email").item(0).getTextContent() + "' ,";
        values += "'" + doc.getElementsByTagName("password").item(0).getTextContent() + "'";
        String sql = "INSERT INTO users (full_name,type,email,password) VALUES (" + values + ");";
        System.out.println(sql);
        try {
            conn.createStatement().executeUpdate(sql);
        } catch (Exception e) {
            System.out.println("Exception:\n" + e);
        }
    }

    public Document getTasks() throws SQLException, ParserConfigurationException{
        Statement stmt;
        ResultSet rs;

        stmt = conn.createStatement();
        String _sql = "select * from tasks t " +
                "join taskTypes tt on t.taskTypeId = tt.id " +
                "join products p on t.productId=p.id " +
                "join environments e on t.envId = e.id " +
                "join additionalInfo a on t.additionalInfoId=a.id;";
        rs = stmt.executeQuery(_sql);
        return Utils.createDocumentFromResultSet((ResultSetImpl) rs, "task");
    }
    /*
    SP Parameters:
        IN taskTypeId int,
        IN productId int,
        IN envId int,
        IN requesterId int,
        IN priority int,
        IN open_date DATE,
        IN status VARCHAR(20),
        IN qaGO bool,
        IN rollBack bool,
        IN urgent bool,
        IN additionalInfoText TEXT
     */
    public boolean saveTask(Task task) throws SQLException, ParserConfigurationException
    {
        Statement stmt;
        ResultSet rs;
        stmt = conn.createStatement();
        String date = new SimpleDateFormat("yyyy-MM-dd").format(task.getOpenDate());
        String sqlCommand = String.format("CALL addTask (%1s,%2s,%3s,%4s,%5s,'%6s','%7s',%8s,%9s,%10s,'%11s')",
                task.getTaskTypeId(),task.getProductId(),task.getEnvId(), task.getRequesterId(), task.getPriority(),
                date, task.getStatus(), task.getQaGo(), task.getRollback(), task.getUrgent(), task.getAdditionalInfo());
        stmt.execute(sqlCommand);
        return true;
    }

    public static void main(String[] args) {
        try {
            JDBC jdbc = new JDBC();
            Document doc = jdbc.getUsers();
            System.out.println(Utils.DocumentToString(doc));
        } catch (Exception ex) {
            System.out.println("threw exception");
            System.out.println(ex);
            // handle the error
        }
    }
}