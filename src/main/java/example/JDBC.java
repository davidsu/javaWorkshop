package example;

import com.mysql.cj.jdbc.result.ResultSetImpl;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.ParserConfigurationException;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

public class JDBC {
    //todo need to implement something to avoid sql injection
    //todo need to make public stuff static, let the getInstance happen only here instead of all over the place
    private Connection conn;

    private static JDBC instance = null;

    public JDBC() throws ClassNotFoundException, IllegalAccessException, InstantiationException, SQLException {
        Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
        conn = DriverManager.getConnection("jdbc:mysql://localhost/java_workshop?autoReconnect=true&useSSL=false", "root", "");
    }

    public static JDBC getInstance() throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException {
        if (instance == null) {
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

    public static void updateTable(String tableName, Document doc, String id) throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException {
        String update = "UPDATE " + tableName + " ";
        String set = "SET " + updateFieldsFromDocument(doc) + " ";
        String where = "WHERE id=" + id + ";";
        String sql = update + set + where;
        System.out.println(sql);
        getInstance().conn.createStatement().executeUpdate(sql);
    }

    public static void insertIntoTable(String tableName, Document doc) throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException {
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

    private static void updateTask(Document doc) throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException {
        //todo need to wrap stuff in a transaction
        Node idNode;
        Node additionalInfoTextNode;
        Node additionalInfoIdTextNode = null;
        String id;
        String additionalInfoText = "";
        String additionalInfoId;

        idNode = doc.getElementsByTagName("id").item(0);
        id = idNode.getTextContent();
        idNode.getParentNode().removeChild(idNode);

        additionalInfoTextNode = doc.getElementsByTagName("additionalInfoText").item(0);
        if(additionalInfoTextNode != null){
            additionalInfoText = additionalInfoTextNode.getTextContent();
            additionalInfoTextNode.getParentNode().removeChild(additionalInfoTextNode);
        }


        additionalInfoIdTextNode = doc.getElementsByTagName("additionalInfoId").item(0);
        additionalInfoId = additionalInfoIdTextNode.getTextContent();
        if(additionalInfoId.length() == 0 && additionalInfoText.length() == 0){
            updateTable("tasks", doc, id);
            return;
        }else if(additionalInfoId.length() == 0){
            String insertAdditionalInfo = "INSERT INTO additionalInfo (information) VALUES ('"+ additionalInfoText + "')";
            System.out.println(insertAdditionalInfo);
            Statement stm = getInstance().conn.createStatement();
            stm.executeUpdate(insertAdditionalInfo, Statement.RETURN_GENERATED_KEYS);
            try (ResultSet generatedKeys = stm.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    additionalInfoIdTextNode.setTextContent(generatedKeys.getLong(1) + "");
                }
                else {
                    throw new SQLException("Creating additionalInfo failed, no ID obtained.");
                }
            }
        }else{
            String updateAdditionalInfo = "update additionalInfo set information='" + additionalInfoText + "' where id=" + additionalInfoId;
            System.out.println(updateAdditionalInfo);
            System.out.println(updateAdditionalInfo);
            getInstance().conn.createStatement().executeUpdate(updateAdditionalInfo);
        }

        updateTable("tasks", doc, id);
    }

    private static void createTask(Document doc) throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException {
        Node additionalInfoTextNode;
        String additionalInfoText = "";

        additionalInfoTextNode = doc.getElementsByTagName("additionalInfoText").item(0);
        if(additionalInfoTextNode != null){
            additionalInfoText = additionalInfoTextNode.getTextContent();
            additionalInfoTextNode.getParentNode().removeChild(additionalInfoTextNode);
        }

        if(additionalInfoText.length() != 0){
            //has additional info, add additionalInfoIdNode

        }
        insertIntoTable("tasks", doc);

    }

    public static void createOrUpdateTask(Document doc) throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException {
        if(doc.getElementsByTagName("id").getLength() == 1){
            updateTask(doc);
        }else{
            createTask(doc);
        }
    }

    public static Document getTaskMetadata() throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException, ParserConfigurationException {
        Connection conn = getInstance().conn;
        Statement stmt;
        ResultSet rs;
        String _sql;


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
        _sql = "select * from additionalInfo";
        rs = stmt.executeQuery(_sql);
        Document additionalInfoDoc = Utils.createDocumentFromResultSet((ResultSetImpl) rs, "additionalInfo", "additionalInfos");

        stmt = conn.createStatement();
        _sql = "select id, full_name, email from users";
        rs = stmt.executeQuery(_sql);
        Document usersDoc = Utils.createDocumentFromResultSet((ResultSetImpl) rs, "user", "users");

        Document[] docs = {taskTypesDoc, productsDoc, environmentsDoc, additionalInfoDoc, usersDoc};
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

    public Document getTasks() throws SQLException, ParserConfigurationException {
        Statement stmt;
        ResultSet rs;

        stmt = conn.createStatement();
//        String _sql = "select * from tasks t " +
//                "join taskTypes tt on t.taskTypeId = tt.id " +
//                "join products p on t.productId=p.id " +
//                "join environments e on t.envId = e.id " +
//                "join additionalInfo a on t.additionalInfoId=a.id;";
        String _sql = "" +
                "select t.id, open_date, status, exec_date, taskType " +
                "from tasks t " +
                "join taskTypes tt on t.taskTypeId = tt.id";
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
    public boolean saveTask(Task task) throws SQLException, ParserConfigurationException {
        Statement stmt;
        ResultSet rs;
        stmt = conn.createStatement();
        String date = new SimpleDateFormat("yyyy-MM-dd").format(task.getOpenDate());
        String sqlCommand = String.format("CALL addTask (%1s,%2s,%3s,%4s,%5s,'%6s','%7s',%8s,%9s,%10s,'%11s')",
                task.getTaskTypeId(), task.getProductId(), task.getEnvId(), task.getRequesterId(), task.getPriority(),
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