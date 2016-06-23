package org.springdoclet.domain;

/**
 * Created by steve on 23-5-2016.
 */
public class Response {

    private final int status;
    private final String statusName;
    private final String description;

    public Response(int status, String description) {
        this.status = status;
        this.statusName = HttpStatus.getHttpStatusName(status);
        this.description = description;
    }

    public int getStatus() {
        return status;
    }

    public String getStatusName() {
        return statusName;
    }

    public String getDescription() {
        return description;
    }

    private enum HttpStatus{

        OK(200),
        CREATED(201),
        ACCEPTED(202),
        NO_CONTENT(204),

        MULTIPLE_CHOICES(300),
        MOVED_PERMANENTLY(301),
        FOUND(302),
        NOT_MODIFIED(304),

        BAD_REQUEST(400),
        UNAUTHORIZED(401),
        FORBIDDEN(403),
        NOT_FOUND(404),
        METHOD_NOT_ALLOWED(405),
        CONFLICT(409),
        GONE(410),
        UNSUPPORTED_MEDIA_TYPE(415),
        I_AM_A_TEAPOT(418),

        INTERNAL_SERVER_ERROR(500),
        NOT_IMPLEMENTED(501),
        BAD_GATEWAY(502),
        SERVICE_UNAVAILABLE(503);

        private int status;

        private HttpStatus(int status){
            this.status = status;
        }

        public static String getHttpStatusName(int code){
            for(HttpStatus status : values()){
                if(status.status == code){
                    return status.name();
                }
            }
            return null;
        }

    }
}
