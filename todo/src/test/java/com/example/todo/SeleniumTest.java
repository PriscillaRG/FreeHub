package com.example.todo;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SeleniumTest {

    static WebDriver driver;

    @BeforeAll
    static void setup() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    }

    @Test
    @Order(1)
    void testLoginPage() {
        driver.get("http://localhost:4200/login");
        Assertions.assertTrue(driver.getTitle().length() > 0);
    }

    @Test
    @Order(2)
    void testLoginWithWrongCredentials() {
        driver.get("http://localhost:4200/login");
        driver.findElement(By.name("username")).sendKeys("fakeuser");
        driver.findElement(By.name("password")).sendKeys("wrongpass");
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(3));
        Assertions.assertNotEquals("http://localhost:4200/dashboard",
            driver.getCurrentUrl());
    }

    @AfterAll
    static void teardown() {
        if (driver != null) driver.quit();
    }
}