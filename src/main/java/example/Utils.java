package example;


import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import java.io.ByteArrayInputStream;
import java.io.IOException;

import org.w3c.dom.Document;
import org.xml.sax.SAXException;

/**
 * Created by davidsu on 12/03/2017.
 */
public class Utils {
    public static Document createDocumentFromString(String xml) throws ParserConfigurationException, IOException, SAXException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();

        Document result = builder.parse(new ByteArrayInputStream(xml.getBytes()));
        return result;
    }
}


