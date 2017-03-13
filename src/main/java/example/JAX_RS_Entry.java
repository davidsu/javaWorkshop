package example;
import com.sun.jersey.api.core.PackagesResourceConfig;
import com.sun.jersey.api.core.ResourceConfig;
import com.sun.net.httpserver.HttpServer;
import com.sun.jersey.api.container.httpserver.HttpServerFactory;

import java.io.*;

public class JAX_RS_Entry {
    public static void main(String[] args) throws IOException {
        ResourceConfig rc = new PackagesResourceConfig("example");
        HttpServer server = HttpServerFactory.create("http://localhost:9998/", rc);
        server.start();
        Task task = new Task(1, 2, 2, 1, 3, "11/03/2017", null, "New", true, true, false,"just a test");
        try {
            JDBC.getInstance().saveTask(task);
        } catch (Exception e) {
            e.printStackTrace();
        }
//        Users us = new Users();
//        System.out.println(us.getUsers());
        System.out.println("Server running");
        System.out.println("Visit: http://localhost:9998/helloworld");
        System.out.println("Hit return to stop...");
        System.in.read();
        System.out.println("Stopping server");
        server.stop(0);
        System.out.println("Server stopped");
    }
}
