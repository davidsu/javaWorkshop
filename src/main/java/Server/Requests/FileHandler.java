package Server.Requests;

import Server.Constants;
import Server.GUID_Generator;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.*;

@Path("/file")
public class FileHandler {
    private Response fileNotFound(String fileName) {
        return Response.status(404).entity(fileName + " not found").build();
    }
    @GET
    @Path("/download/{fileName : .+}")
    public Response downloadFile(@PathParam("fileName") String fileName){
        try {
            File file = new File(Constants.UPLOAD_DIR + "/" + fileName);
            return Response.ok(new FileInputStream(file)).build();
        } catch (FileNotFoundException e) {
            return fileNotFound(fileName);
        }
    }

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadFile(
            @FormDataParam("file") InputStream uploadedInputStream,
            @FormDataParam("file") FormDataContentDisposition fileDetails) {
        String uploadedFileName = "_" + GUID_Generator.generateGuid() + "_" + fileDetails.getFileName();
        String uploadedFileLocation = Constants.UPLOAD_DIR + "/" + uploadedFileName;
        System.out.println(uploadedFileLocation);
        try {
            saveToFile(uploadedInputStream, uploadedFileLocation);
        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .type("text/plain")
                    .entity("Unable to save file " + fileDetails.getName())
                    .build();
        }

        return Response.status(200).entity(uploadedFileName).build();

    }

    private void saveToFile(InputStream uploadedInputStream,
                            String uploadedFileLocation) throws IOException {

            OutputStream out;
            int read;
            byte[] bytes = new byte[1024];

            out = new FileOutputStream(new File(uploadedFileLocation));
            while ((read = uploadedInputStream.read(bytes)) != -1) {
                out.write(bytes, 0, read);
            }
            out.flush();
            out.close();
    }
}
