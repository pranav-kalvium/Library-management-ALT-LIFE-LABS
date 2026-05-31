-- =============================================
-- SQL Queries for Library Management System
-- =============================================

-- =================================================================
-- Query 1 — Books that have never been issued to anyone
-- This helps librarians identify books that might need promotion
-- or could be candidates for removal from the collection.
-- =================================================================
SELECT 
    b.book_name AS "Book Name",
    b.book_publisher AS "Author"
FROM book b
LEFT JOIN issuance i ON b.book_id = i.book_id
WHERE i.book_id IS NULL
ORDER BY b.book_name;


-- =================================================================
-- Query 2 — All books currently issued and not yet returned
-- The core report for tracking outstanding loans. Ordered by
-- target return date so the most overdue books appear first.
-- =================================================================
SELECT
    m.mem_name AS "Member Name",
    b.book_name AS "Book Name",
    DATE_FORMAT(i.issuance_date, '%d %b %Y') AS "Issued Date",
    DATE_FORMAT(i.target_return_date, '%d %b %Y') AS "Target Return Date",
    b.book_publisher AS "Author"
FROM issuance i
JOIN member m ON i.issuance_member = m.mem_id
JOIN book b ON i.book_id = b.book_id
WHERE i.issuance_status = 'pending'
ORDER BY i.target_return_date ASC;


-- =================================================================
-- Query 3 — Top 10 books ranked by total number of times borrowed
-- Useful for understanding which books are most popular, and how
-- many unique members have borrowed each title.
-- =================================================================
SELECT
    b.book_name AS "Book Name",
    COUNT(i.issuance_id) AS "# of times borrowed",
    COUNT(DISTINCT i.issuance_member) AS "# of Members that borrowed"
FROM issuance i
JOIN book b ON i.book_id = b.book_id
GROUP BY b.book_id, b.book_name
ORDER BY COUNT(i.issuance_id) DESC
LIMIT 10;
