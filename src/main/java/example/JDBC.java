package example;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.StringWriter;
import java.sql.*;
import java.text.SimpleDateFormat;

public class JDBC {
    private Connection conn;

    private static JDBC instance = null;
    public JDBC() throws ClassNotFoundException, IllegalAccessException, InstantiationException, SQLException {
        Class.forName("com.mysql.jdbc.Driver").newInstance();
        conn = DriverManager.getConnection("jdbc:mysql://localhost/java_workshop", "root", "");
    }

    public static JDBC getInstance() throws ClassNotFoundException, SQLException, InstantiationException, IllegalAccessException {
        if(instance == null) {
            instance = new JDBC();
        }
        return instance;
    }

    private Element generateXMLElement(ResultSet rs, String columnName, Document doc) throws SQLException {
        Element el = doc.createElement(columnName);
        el.appendChild(doc.createTextNode(rs.getString(columnName)));
        return el;
    }

    private Element generateUserElement(ResultSet rs, Document doc) throws SQLException {
        Element user = doc.createElement("user");
        user.appendChild(generateXMLElement(rs, "id", doc));
        user.appendChild(generateXMLElement(rs, "full_name", doc));
        user.appendChild(generateXMLElement(rs, "type", doc));
        user.appendChild(generateXMLElement(rs, "email", doc));
        user.appendChild(generateXMLElement(rs, "password", doc));
        return user;

    }

    public Document getUsers() throws SQLException, ParserConfigurationException {
        Statement stmt;
        ResultSet rs;
        DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder = docFactory.newDocumentBuilder();

        // root elements
        Document doc = docBuilder.newDocument();
        Element rootElement = doc.createElement("users");
        doc.appendChild(rootElement);


        stmt = conn.createStatement();
        rs = stmt.executeQuery("SELECT * FROM users");
        while(rs.next()){
            rootElement.appendChild(generateUserElement(rs, doc));
        }
        return doc;
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


    public static String toString(Document doc) {
        try {
            StringWriter sw = new StringWriter();
            TransformerFactory tf = TransformerFactory.newInstance();
            Transformer transformer = tf.newTransformer();
            transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
            transformer.setOutputProperty(OutputKeys.METHOD, "xml");
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            transformer.transform(new DOMSource(doc), new StreamResult(sw));
            return sw.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Error converting to String", ex);
        }
    }

    public static void main(String[] args) {
        try {
            JDBC jdbc = new JDBC();
            Document doc = jdbc.getUsers();
            System.out.println(toString(doc));
        } catch (Exception ex) {
            System.out.println("threw exception");
            System.out.println(ex);
            // handle the error
        }
    }
}