# Validation Document: Library Management System

**Candidate:** Pranav Prakash
**Date:** May 30, 2026
**GitHub Repository:** https://github.com/pranav-kalvium/Library-management-ALT-LIFE-LABS

## 1. Overview
This document outlines the validation and testing performed on the Library Management System. The system was built using MySQL, Node.js/Express, and React, and is containerized using Docker Compose.

*Note as per assignment instructions: Parts of this project's initial boilerplate, database schema, and Docker configurations were built with AI assistance (Claude/Gemini) acting as a productivity tool. The architecture, API structure, and SQL queries were reviewed, understood, and tested by me to ensure they meet all requirements.*

---

## 2. Validation of Base Requirements

### 2.1 Database & Hosting
The database model was created according to the provided ER diagram and hosted locally using a Dockerized MySQL 8 container.

**Validation:**
- Database `libmgmt` was successfully created.
- All 6 tables (`member`, `membership`, `collection`, `category`, `book`, `issuance`) were created with correct foreign key constraints.
- Seed data was injected successfully on startup.

*(Insert screenshot of MySQL tables or docker logs showing successful DB initialization)*
```text
# MySQL database initialized with 6 tables
mysql> SHOW TABLES;
+-------------------+
| Tables_in_libmgmt |
+-------------------+
| book              |
| category          |
| collection        |
| issuance          |
| member            |
| membership        |
+-------------------+
```

### 2.2 CRUD RESTful APIs
APIs were built using Express.js. All endpoints require an `x-api-key` header (except `/health`) for basic security.

#### A. Member API
- `POST /member`: Successfully creates a new member and auto-creates an active membership.
- `GET /member`: Retrieves all members with their membership status.
- `GET /member/:id`: Retrieves specific member details along with their issuance history.
- `PUT /member/:id`: Updates member information.

*(Insert screenshot of Postman/cURL testing the Member API)*
```json
// GET /member/1
{
  "mem_id": 1,
  "mem_name": "Aarav Sharma",
  "mem_phone": "9999999999",
  "mem_email": "aarav.sharma@gmail.com",
  "membership_status": "active",
  "issuances": [
    {
      "issuance_id": 15,
      "book_name": "The Pragmatic Programmer",
      "issuance_date": "2026-01-20T10:00:00.000Z",
      "target_return_date": "2026-02-03T10:00:00.000Z",
      "issuance_status": "returned"
    }
  ]
}
```

#### B. Book API
- `POST /book`: Successfully adds a new book.
- `GET /book`: Retrieves all books with joined Category and Collection names.
- `GET /book/:id`: Retrieves book details and total `issuance_count`.
- `PUT /book/:id`: Updates book details.

*(Insert screenshot of Postman/cURL testing the Book API)*
```json
// GET /book/1
{
  "book_id": 1,
  "book_name": "The God of Small Things",
  "book_launch_date": "2010-06-15T00:00:00.000Z",
  "book_publisher": "Arundhati Roy",
  "book_cat_id": 1,
  "book_collection_id": 1,
  "cat_name": "Literature",
  "sub_cat_name": "Indian Fiction",
  "collection_name": "Fiction",
  "issuance_count": 3
}
```

#### C. Issuance API
- `POST /issuance`: Successfully creates a new book issuance.
- `GET /issuance`: Retrieves all issuances.
- `PUT /issuance/:id`: Successfully updates an issuance (e.g., changing status to 'returned').

*(Insert screenshot of Postman/cURL testing the Issuance API)*
```json
// GET /issuance/pending/today
[
  {
    "issuance_id": 1,
    "mem_name": "Aarav Sharma",
    "book_name": "The God of Small Things",
    "issuance_date": "2026-04-10T10:00:00.000Z",
    "target_return_date": "2026-04-25T10:00:00.000Z",
    "issuance_status": "pending",
    "issued_by": "Librarian Deepa"
  }
  // ... 10 more records
]
```

---

## 3. Validation of Add-on Requirements

### 3.1 Dashboard UI
A React dashboard was built to display members with pending book returns.

**Validation:**
- The UI fetches data from the `GET /issuance/pending/today` endpoint.
- It displays a clean table with Member Name, Book Name, Issued Date, Target Return Date, and Status.
- Statuses are dynamically color-coded: **Overdue** (Red), **Due Soon** (Orange), and **On Time** (Green).

*(Insert screenshot of the React Dashboard running in the browser)*
*(Please open http://localhost:5173 in your browser and take a screenshot of the Dashboard UI using `Windows Key + Shift + S`. Paste the image here.)*

---

## 4. Validation of SQL Queries

The required SQL queries (located in `sql/queries.sql`) were executed against the database.

### Query 1: Books Never Borrowed
*Successfully returned books that have no records in the issuance table.*

*(Insert screenshot of Query 1 output)*
```text
+---------------------------------------------------+--------------------+
| Book Name                                         | Author             |
+---------------------------------------------------+--------------------+
| Design Patterns                                   | Erich Gamma et al. |
| Guns, Germs, and Steel                            | Jared Diamond      |
| India After Gandhi                                | Ramachandra Guha   |
| Introduction to Algorithms                        | Thomas H. Cormen   |
| Structure and Interpretation of Computer Programs | Harold Abelson     |
| Surely You're Joking, Mr. Feynman!                | Richard P. Feynman |
| The Code Book                                     | Simon Singh        |
| The Discovery of India                            | Jawaharlal Nehru   |
| The Guide                                         | R.K. Narayan       |
| Thinking, Fast and Slow                           | Daniel Kahneman    |
+---------------------------------------------------+--------------------+
```

### Query 2: Outstanding Books
*Successfully listed all books with a 'pending' status, ordered by target return date.*

*(Insert screenshot of Query 2 output)*
```text
+--------------+---------------------------------------+-------------+--------------------+-------------------+
| Member Name  | Book Name                             | Issued Date | Target Return Date | Author            |
+--------------+---------------------------------------+-------------+--------------------+-------------------+
| Aarav Sharma | The God of Small Things               | 10 Apr 2026 | 25 Apr 2026        | Arundhati Roy     |
| Ananya Iyer  | Midnight's Children                   | 15 Apr 2026 | 01 May 2026        | Salman Rushdie    |
| Ishita Gupta | A Brief History of Time               | 20 Apr 2026 | 05 May 2026        | Stephen Hawking   |
| Arjun Nair   | A Brief History of Time               | 01 May 2026 | 15 May 2026        | Stephen Hawking   |
| Priya Patel  | Clean Code                            | 05 May 2026 | 20 May 2026        | Robert C. Martin  |
| Arjun Nair   | Midnight's Children                   | 15 May 2026 | 29 May 2026        | Salman Rushdie    |
| Vikram Singh | A Suitable Boy                        | 20 May 2026 | 01 Jun 2026        | Vikram Seth       |
| Kavya Joshi  | The Immortals of Meluha               | 22 May 2026 | 02 Jun 2026        | Amish Tripathi    |
| Meera Bhat   | Sapiens: A Brief History of Humankind | 25 May 2026 | 15 Jun 2026        | Yuval Noah Harari |
| Ishita Gupta | The Elegant Universe                  | 27 May 2026 | 20 Jun 2026        | Brian Greene      |
| Rohan Mehta  | Cosmos                                | 28 May 2026 | 25 Jun 2026        | Carl Sagan        |
+--------------+---------------------------------------+-------------+--------------------+-------------------+
```

### Query 3: Top 10 Most Borrowed Books
*Successfully returned the top 10 books ranked by total borrows, along with the count of unique members who borrowed them.*

*(Insert screenshot of Query 3 output)*
```text
+-------------------------------+---------------------+----------------------------+
| Book Name                     | # of times borrowed | # of Members that borrowed |
+-------------------------------+---------------------+----------------------------+
| The God of Small Things       |                   3 |                          3 |
| Midnight's Children           |                   2 |                          2 |
| A Brief History of Time       |                   2 |                          2 |
| Clean Code                    |                   2 |                          2 |
| Train to Pakistan             |                   1 |                          1 |
| The White Tiger               |                   1 |                          1 |
| A Suitable Boy                |                   1 |                          1 |
| One Hundred Years of Solitude |                   1 |                          1 |
| Cosmos                        |                   1 |                          1 |
| The Selfish Gene              |                   1 |                          1 |
+-------------------------------+---------------------+----------------------------+
```

---

## 5. End-to-End Docker Validation

The entire application runs via `docker compose up --build`.

**Validation:**
- `libmgmt-db` started successfully on port 3307.
- `libmgmt-api` started successfully on port 3000 and connected to the DB via retry loop.
- `libmgmt-frontend` built via multi-stage Dockerfile and served via nginx on port 5173.

*(Insert screenshot of the terminal showing the 3 Docker containers running)*
```text
NAMES              IMAGE                         STATUS                  PORTS
libmgmt-frontend   library-management-frontend   Up 20 hours             0.0.0.0:5173->80/tcp, [::]:5173->80/tcp
libmgmt-api        library-management-backend    Up 20 hours             0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
libmgmt-db         mysql:8.0                     Up 20 hours (healthy)   0.0.0.0:3307->3306/tcp, [::]:3307->3306/tcp
```
