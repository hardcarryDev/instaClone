package com.example.demo.util;

import com.example.demo.provider.ApplicationContextProvider;
import org.springframework.context.ApplicationContext;

public class BeanUtil {
	public static Object getBean(Class<?> classType) {
        ApplicationContext applicationContext = ApplicationContextProvider.getApplicationContext();
        return applicationContext.getBean(classType);
    }
	
	public static Object getBean(String beanName) {
        ApplicationContext applicationContext = ApplicationContextProvider.getApplicationContext();
        return applicationContext.getBean(beanName);
    }
}
