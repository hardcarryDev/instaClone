package com.example.demo.annotation;

import java.lang.annotation.*;
import org.apache.ibatis.annotations.Mapper;

/**
 * Marker interface for MyBatis mappers.
 * <p>
 * <b>How to use:</b>
 *
 * <pre>
 * &#064;Mapper
 * public interface UserMapper {
 *   // ...
 * }
 * </pre>
 *
 * @author Frank David Martínez
 */
@Documented
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.TYPE, ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER })
@Mapper
public @interface CommonMapper {
  // Interface Mapper
}
