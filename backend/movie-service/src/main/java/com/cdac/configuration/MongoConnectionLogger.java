//package com.cdac.configuration;
//
//
//import jakarta.annotation.PostConstruct;
//import lombok.RequiredArgsConstructor;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.mongodb.core.MongoTemplate;
//
//@Configuration
//@RequiredArgsConstructor
//public class MongoConnectionLogger {
//
//    private final MongoTemplate mongoTemplate;
//    @Value("${spring.data.mongodb.uri}")
//    private String mongoUri;
//
//    @PostConstruct
//    public void logMongoDetails() {
//
////        var mongoClient = mongoDbFactory.getMongoClient();
//
//        System.out.println("=================================");
//        System.out.println("MongoDB Database : " + mongoTemplate.getDb().getName());
////        System.out.println("MongoDB Client   : " + mongoClient);
//        System.out.println("URI  : " + mongoUri);
//        System.out.println("=================================");
//    }
//}
