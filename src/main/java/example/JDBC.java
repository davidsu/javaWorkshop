package example;

import com.mysql.cj.jdbc.result.ResultSetImpl;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.ParserConfigurationException;
import java.sql.*;
import java.util.ArrayList;

public class JDBC {
    //todo need to implement something to avoid sql injection
    private Connection conn;

    private static JDBC instance = null;

    public JDBC() throws ClassNotFoundException, IllegalAccessException, InstantiationException, SQLException {
        Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
        conn = DriverManager.getConnection("jdbc:mysql://localhost/java_workshop?autoReconnect=true&useSSL=false", "root", "");
    }

    private static JDBC getInstance() throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException {
        if (instance == null) {
            instance = new JDBC();
        }
        return instance;
    }

    public static Document getUsers() throws SQLException, ParserConfigurationException, InstantiationException, IllegalAccessException, ClassNotFoundException {
        Statement stmt;
        ResultSet rs;
        stmt = getInstance().conn.createStatement();
        rs = stmt.executeQuery("SELECT * FROM users");
        return Utils.createDocumentFromResultSet((ResultSetImpl) rs, "user");
    }

    private static boolean needToQuote(String str) {
        if (str.matches("^(\\d+|true|false|NULL)$")) {
            return false;
        }
        return true;
    }

    private static String updateFieldsFromDocument(Document doc) {
        NodeList children = doc.getFirstChild().getChildNodes();
        ArrayList<String> arralistresult = new ArrayList<>();
        for (int i = 0; i < children.getLength(); i++) {
            Node curr = children.item(i);
            String text = curr.getTextContent().trim();
            if (text != null && text.length() == 0) {
                text = "NULL";
            }
            if (needToQuote(text)) {
                text = "'" + text + "'";
            }
            arralistresult.add(curr.getNodeName() + "=" + text);
        }
        return String.join(", ", arralistresult);
    }

    private static void updateTable(String tableName, Document doc, String id) throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException {
        String update = "UPDATE " + tableName + " ";
        String set = "SET " + updateFieldsFromDocument(doc) + " ";
        String where = "WHERE id=" + id + ";";
        String sql = update + set + where;
        System.out.println(sql);
        getInstance().conn.createStatement().executeUpdate(sql);
    }

    private static void insertIntoTable(String tableName, Document doc) throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException {
        ArrayList<String> columns = new ArrayList<>();
        ArrayList<String> values = new ArrayList<>();
        NodeList children = doc.getFirstChild().getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node curr = children.item(i);
            String text = curr.getTextContent().trim();
            if (text != null && text.length() == 0) {
                text = "NULL";
            }
            if (needToQuote(text)) {
                text = "'" + text + "'";
            }
            values.add(text);
            columns.add(curr.getNodeName());
        }
        String sql = "" +
                "INSERT INTO " +
                tableName +
                " ("+ String.join(",", columns) + ") "+
                "VALUES (" + String.join(",", values) + ");";
        System.out.println(sql);
        getInstance().conn.createStatement().executeUpdate(sql);

    }

    private static void updateTableFromDocument(Document doc, String tableName) throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException {
        Node idNode;
        String id;

        idNode = doc.getElementsByTagName("id").item(0);
        id = idNode.getTextContent();
        idNode.getParentNode().removeChild(idNode);

        updateTable(tableName, doc, id);
    }

    public static void createOrUpdateTask(Document doc) throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException {
        if(doc.getElementsByTagName("id").getLength() == 1){
            updateTableFromDocument(doc, "tasks");
        }else{
            insertIntoTable("tasks", doc);
        }
    }

    public static void createOrUpdateUser(Document doc) throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException {
        if(doc.getElementsByTagName("id").getLength() == 1){
            updateTableFromDocument(doc, "users");
        }else{
            insertIntoTable("users", doc);
        }
    }

    public static Document getTaskMetadata() throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException, ParserConfigurationException {
        Connection conn = getInstance().conn;
        ResultSet rs;
        String _sql;
        Statement stmt = conn.createStatement();


        stmt = conn.createStatement();
        _sql = "select * from taskTypes";
        rs = stmt.executeQuery(_sql);
        Document taskTypesDoc = Utils.createDocumentFromResultSet((ResultSetImpl) rs, "taskTypeEntry", "taskTypes");

        stmt = conn.createStatement();
        _sql = "select * from products";
        rs = stmt.executeQuery(_sql);
        Document productsDoc = Utils.createDocumentFromResultSet((ResultSetImpl) rs, "product", "products");

        stmt = conn.createStatement();
        _sql = "select * from environments";
        rs = stmt.executeQuery(_sql);
        Document environmentsDoc = Utils.createDocumentFromResultSet((ResultSetImpl) rs, "environment", "environments");

        stmt = conn.createStatement();
        _sql = "select id, full_name, email from users";
        rs = stmt.executeQuery(_sql);
        Document usersDoc = Utils.createDocumentFromResultSet((ResultSetImpl) rs, "user", "users");

        stmt = conn.createStatement();
        _sql = "select * from priority";
        rs = stmt.executeQuery(_sql);
        Document priorityDoc = Utils.createDocumentFromResultSet((ResultSetImpl) rs, "priority", "priorities");

        stmt = conn.createStatement();
        _sql = "select * from status";
        rs = stmt.executeQuery(_sql);
        Document statusDoc = Utils.createDocumentFromResultSet((ResultSetImpl) rs, "status", "statuses");

        Document[] docs = {taskTypesDoc, productsDoc, environmentsDoc, usersDoc, priorityDoc, statusDoc};
        return Utils.mergeDocs(docs);

    }

    public static Document getTask(String taskId) throws SQLException, ParserConfigurationException, InstantiationException, IllegalAccessException, ClassNotFoundException {
        Statement stmt;
        ResultSet rs;
        String _sql;
        Connection conn = getInstance().conn;

        stmt = conn.createStatement();
        _sql = "select * from tasks where id = " + taskId;
        rs = stmt.executeQuery(_sql);
        Document tasksDoc = Utils.createDocumentFromResultSet((ResultSetImpl) rs, "task", "tasks");

        Document metadata = getTaskMetadata();
        Document[] docs = {tasksDoc, metadata};
        return Utils.mergeDocs(docs);

    }

    public static Document getTasks() throws SQLException, ParserConfigurationException, InstantiationException, IllegalAccessException, ClassNotFoundException {
        Statement stmt;
        ResultSet rs;

        stmt = getInstance().conn.createStatement();
        String _sql = "" +
                "select t.id, open_date, statusName as status, exec_date, taskType " +
                "from tasks t " +
                "join taskTypes tt on t.taskTypeId = tt.id " +
                "join status s on t.statusId = s.id";
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
//    public boolean saveTask(Task task) throws SQLException, ParserConfigurationException {
//        Statement stmt;
//        ResultSet rs;
//        stmt = conn.createStatement();
//        String date = new SimpleDateFormat("yyyy-MM-dd").format(task.getOpenDate());
//        String sqlCommand = String.format("CALL addTask (%1s,%2s,%3s,%4s,%5s,'%6s','%7s',%8s,%9s,%10s,'%11s')",
//                task.getTaskTypeId(), task.getProductId(), task.getEnvId(), task.getRequesterId(), task.getPriority(),
//                date, task.getStatus(), task.getQaGo(), task.getRollback(), task.getUrgent(), task.getAdditionalInfo());
//        stmt.execute(sqlCommand);
//        return true;
//    }

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