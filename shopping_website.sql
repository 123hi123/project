CREATE DATABASE shopping_website;
USE shopping_website;

CREATE TABLE User(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    address VARCHAR(50),
    identity ENUM('Customer', 'Employee', 'Administrator') NOT NULL,
    phone VARCHAR(50),
    sex VARCHAR(50) NOT NULL,
    verified BOOL DEFAULT false
);
DESCRIBE User;

CREATE TABLE User_Verified (
    account VARCHAR(50) PRIMARY KEY,
    password VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    application_data DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);
DESCRIBE User_Verified;

CREATE TABLE Product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(50),
    price INT NOT NULL,
    stock INT NOT NULL,
    state ENUM('on', 'not') NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    discount INT,
    seller_id INT NOT NULL,
    image_url VARCHAR(50),
    FOREIGN KEY (seller_id) REFERENCES User(user_id)
);
DESCRIBE Product;

CREATE TABLE Discount (
    discount_code VARCHAR(50) PRIMARY KEY,
    description VARCHAR(50) NOT NULL,
    discount_type ENUM('freight', 'product') NOT NULL,
    start_date DATE NOT NULL,
    end_data DATE NOT NULL,
    discount_amount INT NOT NULL,
    discount_limit INT NOT NULL
);
DESCRIBE Discount;

CREATE TABLE Order_Table(
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    discount_id VARCHAR(50),
    order_date DATE NOT NULL,
    total_price INT NOT NULL,
    state ENUM('Received', 'Processing', 'Finish') NOT NULL,
    address VARCHAR(50) NOT NULL,
    freight INT NOT NULL,
    deliver_method ENUM('Supermarket', 'Home') NOT NULL,
    pay_method ENUM('Credit Card', 'Cash') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (discount_id) REFERENCES Discount(discount_code)
);
DESCRIBE Order_Table;

CREATE TABLE Order_item (
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES Order_Table(order_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);
DESCRIBE Order_item;

CREATE TABLE Cart_item (
    user_id INT,
    product_id INT,
    quantity INT NOT NULL,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);
DESCRIBE Cart_item;

CREATE TABLE Product_Review (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL,
    content VARCHAR(150),
    created_time DATETIME,
    is_verified BOOL DEFAULT true,
    is_visible BOOL DEFAULT true,
    seller_reply VARCHAR(150),
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);
DESCRIBE Product_Review;

CREATE TABLE Used_Discount (
    user_id INT,
    discount_id VARCHAR(50),
    PRIMARY KEY (user_id, discount_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (discount_id) REFERENCES Discount(discount_code)
);
DESCRIBE Used_Discount;

CREATE TABLE Credit_Card (
    user_id INT,
    credit_card VARCHAR(20) PRIMARY KEY,
    security_code INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);
DESCRIBE Credit_Card;
                    

