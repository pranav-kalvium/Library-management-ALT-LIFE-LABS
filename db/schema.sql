CREATE DATABASE IF NOT EXISTS libmgmt;
USE libmgmt;

CREATE TABLE member (
  mem_id INT AUTO_INCREMENT PRIMARY KEY,
  mem_name VARCHAR(100) NOT NULL,
  mem_phone VARCHAR(20),
  mem_email VARCHAR(100)
);

CREATE TABLE membership (
  membership_id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  FOREIGN KEY (member_id) REFERENCES member(mem_id)
);

CREATE TABLE collection (
  collection_id INT AUTO_INCREMENT PRIMARY KEY,
  collection_name VARCHAR(100) NOT NULL
);

CREATE TABLE category (
  cat_id INT AUTO_INCREMENT PRIMARY KEY,
  cat_name VARCHAR(100) NOT NULL,
  sub_cat_name VARCHAR(100)
);

CREATE TABLE book (
  book_id INT AUTO_INCREMENT PRIMARY KEY,
  book_name VARCHAR(200) NOT NULL,
  book_cat_id INT,
  book_collection_id INT,
  book_launch_date DATETIME,
  book_publisher VARCHAR(100),
  FOREIGN KEY (book_cat_id) REFERENCES category(cat_id),
  FOREIGN KEY (book_collection_id) REFERENCES collection(collection_id)
);

CREATE TABLE issuance (
  issuance_id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  issuance_date DATETIME NOT NULL,
  issuance_member INT NOT NULL,
  issued_by VARCHAR(100),
  target_return_date DATETIME NOT NULL,
  issuance_status VARCHAR(20) DEFAULT 'pending',
  FOREIGN KEY (book_id) REFERENCES book(book_id),
  FOREIGN KEY (issuance_member) REFERENCES member(mem_id)
);
