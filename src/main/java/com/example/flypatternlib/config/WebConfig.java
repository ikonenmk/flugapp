package com.example.flypatternlib.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Handle file serving for uploaded images
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Maps requests to /images/** to files in C:/uploads/images/
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:/uploads/images/");
    }
}
