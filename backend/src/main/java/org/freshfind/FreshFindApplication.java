package org.freshfind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class FreshFindApplication {
    public static void main(String[] args) {
        SpringApplication.run(FreshFindApplication.class, args);
    }
}
