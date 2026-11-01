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
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.example.java_ecommerce.dto.ExceptionResDto;
import com.example.java_ecommerce.dto.ValidExceptionDto;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice 
public class GlobleExceptionHandler {

    @ExceptionHandler (AccessDeniedException.class)
    public ResponseEntity<ExceptionResDto> accessDeniedExceptionHandler(AccessDeniedException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto.Builder()
                .withSuccess(false)
                .withMessage(ex.getMessage())
                .withStatusCode(HttpStatus.FORBIDDEN.value())
                .withTimestamp(System.currentTimeMillis())
                .withPath(request.getRequestURI())
                .withError(HttpStatus.FORBIDDEN.getReasonPhrase())
                .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exceptionResDto);
    }

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ExceptionResDto> fileUploadExceptionHandler(FileUploadException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto.Builder()
                .withSuccess(false)
                .withMessage(ex.getMessage())
                .withStatusCode(HttpStatus.BAD_REQUEST.value())
                .withTimestamp(System.currentTimeMillis())
                .withPath(request.getRequestURI())
                .withError(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exceptionResDto);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ExceptionResDto> maxUploadSizeExceededExceptionHandler(MaxUploadSizeExceededException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto.Builder()
                .withSuccess(false)
                .withMessage("File upload size exceeded the maximum allowed limit")
                .withStatusCode(HttpStatus.CONTENT_TOO_LARGE.value())
                .withTimestamp(System.currentTimeMillis())
                .withPath(request.getRequestURI())
                .withError(HttpStatus.CONTENT_TOO_LARGE.getReasonPhrase())
                .build();
        return ResponseEntity.status(HttpStatus.CONTENT_TOO_LARGE).body(exceptionResDto);
    }

    @ExceptionHandler(UserNotAuthorizeException.class)
    public ResponseEntity<ExceptionResDto> userNotAuthorizeExceptionHandler(UserNotAuthorizeException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto.Builder()
                        .withSuccess(false)
                        .withMessage(ex.getMessage())
                        .withStatusCode(HttpStatus.UNAUTHORIZED.value())
                        .withTimestamp(System.currentTimeMillis())
                        .withPath(request.getRequestURI())
                        .withError(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                        .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exceptionResDto);
    }

    @ExceptionHandler(PasswordNotMatchesException.class)
    public ResponseEntity<ExceptionResDto> passwordNotMatchesExceptionHandler(PasswordNotMatchesException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto.Builder()
                        .withSuccess(false)
                        .withMessage(ex.getMessage())
                        .withStatusCode(HttpStatus.UNAUTHORIZED.value())
                        .withTimestamp(System.currentTimeMillis())
                        .withPath(request.getRequestURI())
                        .withError(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                        .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exceptionResDto);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionResDto> resourceNotFoundExceptionHandler(ResourceNotFoundException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto.Builder()
                        .withSuccess(false)
                        .withMessage(ex.getMessage())
                        .withStatusCode(HttpStatus.NOT_FOUND.value())
                        .withTimestamp(System.currentTimeMillis())
                        .withPath(request.getRequestURI())
                        .withError(HttpStatus.NOT_FOUND.getReasonPhrase())
                        .build();
        return ResponseEntity.status(404).body(exceptionResDto);
    }
    
    @ExceptionHandler(DuplicateExceptionHandler.class)
    public ResponseEntity<ExceptionResDto> duplicateExceptionHandler(DuplicateExceptionHandler ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto.Builder()
                .withSuccess(false)
                .withMessage(ex.getMessage())
                .withStatusCode(HttpStatus.CONFLICT.value())
                .withTimestamp(System.currentTimeMillis())
                .withPath(request.getRequestURI())
                .withError(HttpStatus.CONFLICT.getReasonPhrase())
                .build();
        return ResponseEntity.status(409).body(exceptionResDto);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidExceptionDto> methodAurgumentNotValidExceptionHandler(MethodArgumentNotValidException ex, HttpServletRequest request){
        
        Map<String, String> errors =new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach((error)->{
            errors.put(error.getField(), error.getDefaultMessage());
        });
        ValidExceptionDto validExceptionDto = new ValidExceptionDto.Builder()
                .withSuccess(false)
                .withMessage("Validation failed for one or more fields")
                .withStatusCode(HttpStatus.BAD_REQUEST.value())
                .withTimestamp(System.currentTimeMillis())
                .withPath(request.getRequestURI())
                .withError(errors)
                .build();
        return ResponseEntity.status(400).body(validExceptionDto);
    }

    @ExceptionHandler(FileException.class)
    public ResponseEntity<ExceptionResDto> fileExceptionHandler(FileException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto.Builder()
                .withSuccess(false)
                .withMessage(ex.getMessage())
                .withStatusCode(HttpStatus.BAD_REQUEST.value())
                .withTimestamp(System.currentTimeMillis())
                .withPath(request.getRequestURI())
                .withError(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exceptionResDto);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ExceptionResDto> mediaTypeNotSupportedHandler(HttpMediaTypeNotSupportedException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto.Builder()
                .withSuccess(false)
                .withMessage(ex.getMessage())
                .withStatusCode(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value())
                .withTimestamp(System.currentTimeMillis())
                .withPath(request.getRequestURI())
                .withError(HttpStatus.UNSUPPORTED_MEDIA_TYPE.getReasonPhrase())
                .build();
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(exceptionResDto);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionResDto> illegalArgumentExceptionHandler(IllegalArgumentException ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto.Builder()
                .withSuccess(false)
                .withMessage(ex.getMessage())
                .withStatusCode(HttpStatus.BAD_REQUEST.value())
                .withTimestamp(System.currentTimeMillis())
                .withPath(request.getRequestURI())
                .withError(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exceptionResDto);
    }

    @ExceptionHandler (Exception.class)
    public ResponseEntity<ExceptionResDto> globalExceptionHandler(Exception ex, HttpServletRequest request){
        ExceptionResDto exceptionResDto=new ExceptionResDto.Builder()
                .withSuccess(false)
                .withMessage(ex.getMessage())
                .withStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .withTimestamp(System.currentTimeMillis())
                .withPath(request.getRequestURI())
                .withError(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .build();
        return ResponseEntity.status(500).body(exceptionResDto);
    }

}

