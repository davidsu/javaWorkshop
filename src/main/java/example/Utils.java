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
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

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
        return DocumentToString(doc, false);
    }
    public static String DocumentToString(Document doc, boolean prettyPrint) {
        try {
            StringWriter sw = new StringWriter();
            TransformerFactory tf = TransformerFactory.newInstance();
            Transformer transformer = tf.newTransformer();
            transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
            transformer.setOutputProperty(OutputKeys.METHOD, "xml");
            if(prettyPrint) {
                transformer.setOutputProperty(OutputKeys.INDENT, "yes");
                transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
            }
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            transformer.transform(new DOMSource(doc), new StreamResult(sw));
            return sw.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Error converting to String", ex);
        }
    }

    public static String buildIdFilter(String ids)
    {
        String[] idsArr = ids.split(",");
        String retVal = "";
        if (idsArr.length == 1)
        {
            retVal = "id = " + idsArr[0];
        }
        if (idsArr.length == 2)
        {
            retVal = "id >=" + idsArr[0] + " and id <=" + idsArr[1];
        }
        return retVal;
    }

    public static boolean checkIds(String ids)
    {
        if (ids != null)
        {
            String[] idsArr = ids.split(",");
            if (idsArr.length == 1 && isNumeric(idsArr[0]))
            {
                return true;
            }
            if (idsArr.length == 2 && isNumeric(idsArr[0]) && isNumeric(idsArr[1]))
            {
                return true;
            }
        }
        return false;
    }

    public static boolean isNumeric(String id)
    {
        if (id.matches("\\d+")) {
            return true;
        }
        return false;
    }

    public static boolean checkDates(String dates)
    {
        if(dates != null)
        {
            String[] datesArr = dates.split(",");
            if (datesArr.length == 1 && dateValid(datesArr[0]))
            {
                return true;
            }
            if (datesArr.length == 2 && dateValid(datesArr[0]) && dateValid(datesArr[1]))
            {
                SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
                Date startD = new Date();
                Date endD = new Date();
                try {
                    startD = formatter.parse(datesArr[0]);
                    endD = formatter.parse(datesArr[1]);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
                if (endD != null && startD != null && endD.compareTo(startD) > 0) //verify that the end date is after the start date
                {
                    return true;
                }
            }
        }
        return false;
    }

    public static boolean dateValid(String date)
    {
        if (date.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return true;
        }
        return false;
    }

    //builds a filter for none date column with multiple values separated by *
    public static String buildFilter(String values, String columnName)
    {
        if(values == null) return null;
        String[] valuesArr = values.split("\\*");
        for (int i=0; i < valuesArr.length; i++)
        {
            valuesArr[i] = columnName + " like '%" + valuesArr[i] + "%' ";
        }
        return String.join(" OR ", valuesArr);
    }

    //builds a filter for dates
    public static String buildDatesFilter(String dates, String dateColumn)
    {
        String[] datesArr = dates.split(",");
        String filter = "";
        if (datesArr.length == 1)
        {
            filter = dateColumn + "= '" +  datesArr[0] + "' ";
        }
        if (datesArr.length == 2)
        {
            filter = dateColumn + " >= '" + datesArr[0] + "' and " + dateColumn + " < '" + datesArr[1] + "' ";
        }
        return filter;
    }

    //adds keys and values to a dictionary from a results set based on the indexes of the key and value columns (from the DB)
    public static  <K,V> void resultSetToDictionary(ResultSet rs, HashMap<K, V> dict, int keyIndex, int valIndex ) throws SQLException {
        ResultSetMetaData md = rs.getMetaData();
        while(rs.next())
        {
            K key = (K) rs.getObject(keyIndex);
            V value =(V) rs.getObject(valIndex);
            dict.put(key, value);
        }
    }

    public static String getElementValueFromDoc(Document doc, String elementName){
        if(doc != null)
        {
            NodeList nodeList = doc.getElementsByTagName(elementName);
            if (nodeList.getLength() > 0)
            {
                return nodeList.item(0).getChildNodes().item(0).getNodeValue();
            }
        }
        return null;
    }

}


