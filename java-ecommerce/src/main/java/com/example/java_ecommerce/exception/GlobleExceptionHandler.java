package com.example.java_ecommerce.exception;

import java.util.HashMap;
import java.util.Map;

import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.java_ecommerce.dto.ExceptionResDto;
import com.example.java_ecommerce.dto.ValidExceptionDto;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice 
public class GlobleExceptionHandler {

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ExceptionResDto> fileUploadExceptionHandler(FileUploadException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto();
        exceptionResDto.setMessage(ex.getMessage());
        exceptionResDto.setStatusCode(HttpStatus.BAD_REQUEST.value());
        exceptionResDto.setTimestamp(System.currentTimeMillis());
        exceptionResDto.setPath(request.getRequestURI());
        exceptionResDto.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exceptionResDto);
    }

    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public ResponseEntity<ExceptionResDto> maxUploadSizeExceededExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto();
        exceptionResDto.setMessage("File upload size exceeded the maximum allowed limit");
        exceptionResDto.setStatusCode(HttpStatus.PAYLOAD_TOO_LARGE.value());
        exceptionResDto.setTimestamp(System.currentTimeMillis());
        exceptionResDto.setPath(request.getRequestURI());
        exceptionResDto.setError(HttpStatus.PAYLOAD_TOO_LARGE.getReasonPhrase());
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(exceptionResDto);
    }

    @ExceptionHandler(UserNotAuthorizeException.class)
    public ResponseEntity<ExceptionResDto> userNotAuthorizeExceptionHandler(UserNotAuthorizeException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto();
        exceptionResDto.setMessage(ex.getMessage());
        exceptionResDto.setStatusCode(HttpStatus.UNAUTHORIZED.value());
        exceptionResDto.setTimestamp(System.currentTimeMillis());
        exceptionResDto.setPath(request.getRequestURI());
        exceptionResDto.setError(HttpStatus.UNAUTHORIZED.getReasonPhrase());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exceptionResDto);
    }

    @ExceptionHandler(PasswordNotMatchesException.class)
    public ResponseEntity<ExceptionResDto> passwordNotMatchesExceptionHandler(PasswordNotMatchesException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto();
        exceptionResDto.setMessage(ex.getMessage());
        exceptionResDto.setStatusCode(HttpStatus.UNAUTHORIZED.value());
        exceptionResDto.setTimestamp(System.currentTimeMillis());
        exceptionResDto.setPath(request.getRequestURI());
        exceptionResDto.setError(HttpStatus.UNAUTHORIZED.getReasonPhrase());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exceptionResDto);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionResDto> resourceNotFoundExceptionHandler(ResourceNotFoundException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto();
        exceptionResDto.setMessage(ex.getMessage());
        exceptionResDto.setStatusCode(HttpStatus.NOT_FOUND.value());
        exceptionResDto.setTimestamp(System.currentTimeMillis());
        exceptionResDto.setPath(request.getRequestURI());
        exceptionResDto.setError(HttpStatus.NOT_FOUND.getReasonPhrase());
        return ResponseEntity.status(404).body(exceptionResDto);
    }
    
    @ExceptionHandler(DuplicateExceptionHandler.class)
    public ResponseEntity<ExceptionResDto> duplicateExceptionHandler(DuplicateExceptionHandler ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto();
        exceptionResDto.setMessage(ex.getMessage());
        exceptionResDto.setStatusCode(HttpStatus.CONFLICT.value());
        exceptionResDto.setTimestamp(System.currentTimeMillis());
        exceptionResDto.setPath(request.getRequestURI());
        exceptionResDto.setError(HttpStatus.CONFLICT.getReasonPhrase());
        return ResponseEntity.status(409).body(exceptionResDto);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidExceptionDto> methodAurgumentNotValidExceptionHandler(MethodArgumentNotValidException ex, HttpServletRequest request){
        ValidExceptionDto validExceptionDto = new ValidExceptionDto();
        validExceptionDto.setMessage("Validation failed for one or more fields");
        validExceptionDto.setStatusCode(HttpStatus.BAD_REQUEST.value());
        validExceptionDto.setTimestamp(System.currentTimeMillis());
        validExceptionDto.setPath(request.getRequestURI());
        Map<String, String> errors =new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach((error)->{
            errors.put(error.getField(), error.getDefaultMessage());
        });
        validExceptionDto.setError(errors);
        return ResponseEntity.status(400).body(validExceptionDto);
    }

    @ExceptionHandler(FileException.class)
    public ResponseEntity<ExceptionResDto> fileExceptionHandler(FileException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto();
        exceptionResDto.setMessage(ex.getMessage());
        exceptionResDto.setStatusCode(HttpStatus.BAD_REQUEST.value());
        exceptionResDto.setTimestamp(System.currentTimeMillis());
        exceptionResDto.setPath(request.getRequestURI());
        exceptionResDto.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exceptionResDto);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ExceptionResDto> mediaTypeNotSupportedHandler(HttpMediaTypeNotSupportedException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto();
        exceptionResDto.setMessage(ex.getMessage());
        exceptionResDto.setStatusCode(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value());
        exceptionResDto.setTimestamp(System.currentTimeMillis());
        exceptionResDto.setPath(request.getRequestURI());
        exceptionResDto.setError(HttpStatus.UNSUPPORTED_MEDIA_TYPE.getReasonPhrase());
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(exceptionResDto);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionResDto> illegalArgumentExceptionHandler(IllegalArgumentException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto();
        exceptionResDto.setMessage(ex.getMessage());
        exceptionResDto.setStatusCode(HttpStatus.BAD_REQUEST.value());
        exceptionResDto.setTimestamp(System.currentTimeMillis());
        exceptionResDto.setPath(request.getRequestURI());
        exceptionResDto.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exceptionResDto);
    }

    @ExceptionHandler (Exception.class)
    public ResponseEntity<ExceptionResDto> globalExceptionHandler(Exception ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto();
        exceptionResDto.setMessage(ex.getMessage());
        exceptionResDto.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        exceptionResDto.setTimestamp(System.currentTimeMillis());
        exceptionResDto.setPath(request.getRequestURI());
        exceptionResDto.setError(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        return ResponseEntity.status(500).body(exceptionResDto);
    }

}
