package com.example.java_ecommerce;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JavaEcommerceApplication {

	public static void main(String[] args) {
		loadEnv();
		SpringApplication.run(JavaEcommerceApplication.class, args);
		System.out.println("Application started successfully.");
	}

	private static void loadEnv() {
		try {
			Path envPath = Paths.get(".env");
			if (Files.exists(envPath)) {
				List<String> lines = Files.readAllLines(envPath);
				for (String line : lines) {
					line = line.trim();
					if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) {
						continue;
					}
					int index = line.indexOf('=');
					String key = line.substring(0, index).trim();
					String value = line.substring(index + 1).trim();
					if ((value.startsWith("\"") && value.endsWith("\"")) ||
					    (value.startsWith("'") && value.endsWith("'"))) {
						value = value.substring(1, value.length() - 1);
					}
					if (System.getProperty(key) == null) {
						System.setProperty(key, value);
					}
				}
			}
		} catch (Exception ignored) {
		}
	}
}
