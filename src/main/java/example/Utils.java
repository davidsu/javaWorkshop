package example;


import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import com.mysql.cj.core.result.Field;
import com.mysql.cj.jdbc.result.ResultSetImpl;
import org.w3c.dom.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.w3c.dom.Document;
import org.xml.sax.SAXException;

/**
 * Created by davidsu on 12/03/2017.
 */
public class Utils {

    private static String[] getColumsNamesFromResultSet(ResultSetImpl rs){rs.getMetadata().getFields();
        Field[] fields = rs.getMetadata().getFields();
        String[] result = new String[fields.length];
        for(int i = 0; i < fields.length; i++){
            result[i] = fields[i].getColumnLabel();
        }
        return result;
    }

    private static Element generateXMLElement(ResultSet rs, String columnName, Document doc) throws SQLException {
        Element el = doc.createElement(columnName);
        String strVal = rs.getString(columnName);
        if(strVal == null){
            strVal = "";
        }
        el.appendChild(doc.createTextNode(strVal));
        return el;
    }

    private static Element generateElement(ResultSetImpl rs, Document doc, String[] columnNames, String elementName) throws SQLException {
        Element elem = doc.createElement(elementName);
        for(String colName: columnNames){
            elem.appendChild(generateXMLElement(rs, colName, doc));
        }
        return elem;
    }

    public static Document createDocumentFromString(String xml) throws ParserConfigurationException, IOException, SAXException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();

        Document result = builder.parse(new ByteArrayInputStream(xml.getBytes()));
        return result;
    }

    public static Document createDocumentFromResultSet(ResultSetImpl rs, String elementName, String rootElementName) throws ParserConfigurationException, SQLException {
        String[] columnNames = Utils.getColumsNamesFromResultSet(rs);
        DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder = docFactory.newDocumentBuilder();

        // root elements
        Document doc = docBuilder.newDocument();
        Element rootElement = doc.createElement(rootElementName);
        doc.appendChild(rootElement);

        while(rs.next()){
            rootElement.appendChild(generateElement(rs, doc, columnNames, elementName));
        }
        return doc;
    }
    public static Document createDocumentFromResultSet(ResultSetImpl rs, String elementName) throws ParserConfigurationException, SQLException {
        return createDocumentFromResultSet(rs, elementName, "root");
    }

    public static Document mergeDocs(Document[] docs) throws ParserConfigurationException {
        DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
        Document doc = docBuilder.newDocument();
        Element rootElement = doc.createElement("root");
        doc.appendChild(rootElement);

        for(Document _doc : docs){
            NodeList nodeList = _doc.getChildNodes();
            for(int i = 0; i < nodeList.getLength(); i++){
                Node node = doc.importNode(nodeList.item(i), true);
                rootElement.appendChild(node);
            }
        }
        return doc;
    }

    public static String DocumentToString(Document doc) {
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
}


