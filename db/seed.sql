USE libmgmt;

-- =============================================
-- Members — 12 members with Indian names
-- =============================================
INSERT INTO member (mem_name, mem_phone, mem_email) VALUES
('Aarav Sharma', '9876543210', 'aarav.sharma@gmail.com'),
('Priya Patel', '9823456789', 'priya.patel@outlook.com'),
('Rohan Mehta', '9812345678', 'rohan.mehta@yahoo.com'),
('Ananya Iyer', '9801234567', 'ananya.iyer@gmail.com'),
('Vikram Singh', '9790123456', 'vikram.singh@hotmail.com'),
('Sneha Reddy', '9789012345', 'sneha.reddy@gmail.com'),
('Arjun Nair', '9778901234', 'arjun.nair@outlook.com'),
('Kavya Joshi', '9767890123', 'kavya.joshi@gmail.com'),
('Aditya Kulkarni', '9756789012', 'aditya.kulkarni@yahoo.com'),
('Meera Bhat', '9745678901', 'meera.bhat@gmail.com'),
('Siddharth Desai', '9734567890', 'siddharth.desai@hotmail.com'),
('Ishita Gupta', '9723456789', 'ishita.gupta@gmail.com');

-- =============================================
-- Memberships — one per member, mix of active/inactive
-- =============================================
INSERT INTO membership (member_id, status) VALUES
(1, 'active'),
(2, 'active'),
(3, 'inactive'),
(4, 'active'),
(5, 'active'),
(6, 'inactive'),
(7, 'active'),
(8, 'active'),
(9, 'inactive'),
(10, 'active'),
(11, 'active'),
(12, 'active');

-- =============================================
-- Collections — 4 collections
-- =============================================
INSERT INTO collection (collection_name) VALUES
('Fiction'),
('Science'),
('History'),
('Technology');

-- =============================================
-- Categories — 5 categories with subcategories
-- =============================================
INSERT INTO category (cat_name, sub_cat_name) VALUES
('Literature', 'Indian Fiction'),
('Literature', 'World Classics'),
('Science', 'Physics'),
('Science', 'Biology'),
('Technology', 'Programming');

-- =============================================
-- Books — 25 books with real titles and publishers/authors
-- =============================================
INSERT INTO book (book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher) VALUES
('The God of Small Things', 1, 1, '2010-06-15 00:00:00', 'Arundhati Roy'),
('Train to Pakistan', 1, 1, '2012-03-22 00:00:00', 'Khushwant Singh'),
('Midnight\'s Children', 2, 1, '2011-09-10 00:00:00', 'Salman Rushdie'),
('The White Tiger', 1, 1, '2013-01-05 00:00:00', 'Aravind Adiga'),
('A Suitable Boy', 2, 1, '2014-07-18 00:00:00', 'Vikram Seth'),
('The Guide', 1, 1, '2010-11-30 00:00:00', 'R.K. Narayan'),
('One Hundred Years of Solitude', 2, 1, '2015-04-12 00:00:00', 'Gabriel García Márquez'),
('A Brief History of Time', 3, 2, '2016-08-20 00:00:00', 'Stephen Hawking'),
('Cosmos', 3, 2, '2011-02-14 00:00:00', 'Carl Sagan'),
('The Selfish Gene', 4, 2, '2017-05-09 00:00:00', 'Richard Dawkins'),
('Sapiens: A Brief History of Humankind', 4, 3, '2018-10-01 00:00:00', 'Yuval Noah Harari'),
('The Discovery of India', 1, 3, '2012-08-15 00:00:00', 'Jawaharlal Nehru'),
('India After Gandhi', 1, 3, '2019-01-26 00:00:00', 'Ramachandra Guha'),
('Clean Code', 5, 4, '2013-06-20 00:00:00', 'Robert C. Martin'),
('The Pragmatic Programmer', 5, 4, '2020-09-15 00:00:00', 'David Thomas & Andrew Hunt'),
('Design Patterns', 5, 4, '2014-03-10 00:00:00', 'Erich Gamma et al.'),
('Introduction to Algorithms', 5, 4, '2015-11-25 00:00:00', 'Thomas H. Cormen'),
('Structure and Interpretation of Computer Programs', 5, 4, '2016-07-04 00:00:00', 'Harold Abelson'),
('The Immortals of Meluha', 1, 1, '2017-02-28 00:00:00', 'Amish Tripathi'),
('2 States', 1, 1, '2018-04-15 00:00:00', 'Chetan Bhagat'),
('The Elegant Universe', 3, 2, '2019-06-30 00:00:00', 'Brian Greene'),
('Surely You\'re Joking, Mr. Feynman!', 3, 2, '2020-12-10 00:00:00', 'Richard P. Feynman'),
('Guns, Germs, and Steel', 4, 3, '2021-03-22 00:00:00', 'Jared Diamond'),
('The Code Book', 5, 4, '2022-08-08 00:00:00', 'Simon Singh'),
('Thinking, Fast and Slow', 4, 2, '2023-01-17 00:00:00', 'Daniel Kahneman');

-- =============================================
-- Issuances — 20 records with various statuses
-- Pending (8+), Returned (6+), mix of overdue and upcoming
-- =============================================
INSERT INTO issuance (book_id, issuance_date, issuance_member, issued_by, target_return_date, issuance_status) VALUES
-- Pending issuances — overdue (target_return_date in the past)
(1,  '2026-04-10 10:00:00', 1,  'Librarian Deepa',  '2026-04-25 10:00:00', 'pending'),
(3,  '2026-04-15 11:30:00', 4,  'Librarian Ramesh', '2026-05-01 11:30:00', 'pending'),
(8,  '2026-05-01 09:00:00', 7,  'Librarian Deepa',  '2026-05-15 09:00:00', 'pending'),
(14, '2026-05-05 14:00:00', 2,  'Librarian Ramesh', '2026-05-20 14:00:00', 'pending'),
-- Pending issuances — due soon (target within next few days)
(5,  '2026-05-20 10:00:00', 5,  'Librarian Deepa',  '2026-06-01 10:00:00', 'pending'),
(19, '2026-05-22 13:00:00', 8,  'Librarian Ramesh', '2026-06-02 13:00:00', 'pending'),
-- Pending issuances — on time (target further in future)
(11, '2026-05-25 11:00:00', 10, 'Librarian Deepa',  '2026-06-15 11:00:00', 'pending'),
(21, '2026-05-27 15:00:00', 12, 'Librarian Ramesh', '2026-06-20 15:00:00', 'pending'),
(9,  '2026-05-28 09:30:00', 3,  'Librarian Deepa',  '2026-06-25 09:30:00', 'pending'),
-- Returned issuances
(2,  '2026-03-01 10:00:00', 2,  'Librarian Deepa',  '2026-03-15 10:00:00', 'returned'),
(4,  '2026-03-10 11:00:00', 6,  'Librarian Ramesh', '2026-03-25 11:00:00', 'returned'),
(7,  '2026-02-15 09:30:00', 9,  'Librarian Deepa',  '2026-03-01 09:30:00', 'returned'),
(10, '2026-04-01 14:00:00', 11, 'Librarian Ramesh', '2026-04-15 14:00:00', 'returned'),
(15, '2026-01-20 10:00:00', 1,  'Librarian Deepa',  '2026-02-03 10:00:00', 'returned'),
(20, '2026-04-10 13:00:00', 4,  'Librarian Ramesh', '2026-04-25 13:00:00', 'returned'),
-- Mix — some books borrowed multiple times by different members
(1,  '2026-02-01 10:00:00', 5,  'Librarian Deepa',  '2026-02-15 10:00:00', 'returned'),
(1,  '2026-03-10 11:00:00', 8,  'Librarian Ramesh', '2026-03-25 11:00:00', 'returned'),
(14, '2026-01-15 09:00:00', 10, 'Librarian Deepa',  '2026-01-30 09:00:00', 'returned'),
(3,  '2026-05-15 14:00:00', 7,  'Librarian Ramesh', '2026-05-29 14:00:00', 'pending'),
(8,  '2026-04-20 10:30:00', 12, 'Librarian Deepa',  '2026-05-05 10:30:00', 'pending');
