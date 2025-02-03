-- Create database if not exists
CREATE DATABASE IF NOT EXISTS click_fit;
USE click_fit;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL DEFAULT 'user',
    active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Create a stored procedure for adding users
DELIMITER //
CREATE PROCEDURE addUser(IN userEmail VARCHAR(255), IN userPassword VARCHAR(255), IN userType VARCHAR(255))
BEGIN
    INSERT INTO users (email, password, type) VALUES (userEmail, userPassword, userType);
END //
DELIMITER ;
