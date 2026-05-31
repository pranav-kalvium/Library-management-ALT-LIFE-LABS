const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /book — all books with category and collection names
router.get('/', async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT 
        b.book_id,
        b.book_name,
        b.book_launch_date,
        b.book_publisher,
        c.cat_name,
        c.sub_cat_name,
        col.collection_name
      FROM book b
      LEFT JOIN category c ON b.book_cat_id = c.cat_id
      LEFT JOIN collection col ON b.book_collection_id = col.collection_id
      ORDER BY b.book_id
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /book/:id — single book with full details and issuance count
router.get('/:id', async (req, res, next) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const [books] = await pool.query(
      `SELECT 
        b.book_id,
        b.book_name,
        b.book_launch_date,
        b.book_publisher,
        b.book_cat_id,
        b.book_collection_id,
        c.cat_name,
        c.sub_cat_name,
        col.collection_name
      FROM book b
      LEFT JOIN category c ON b.book_cat_id = c.cat_id
      LEFT JOIN collection col ON b.book_collection_id = col.collection_id
      WHERE b.book_id = ?`,
      [id]
    );

    if (books.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const [countResult] = await pool.query(
      'SELECT COUNT(*) AS issuance_count FROM issuance WHERE book_id = ?',
      [id]
    );

    res.json({
      ...books[0],
      issuance_count: countResult[0].issuance_count,
    });
  } catch (err) {
    next(err);
  }
});

// POST /book — create new book
router.post('/', async (req, res, next) => {
  try {
    const pool = getPool();
    const {
      book_name,
      book_cat_id,
      book_collection_id,
      book_launch_date,
      book_publisher,
    } = req.body;

    if (!book_name) {
      return res.status(400).json({ error: 'book_name is required' });
    }

    const [result] = await pool.query(
      `INSERT INTO book (book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher)
       VALUES (?, ?, ?, ?, ?)`,
      [
        book_name,
        book_cat_id || null,
        book_collection_id || null,
        book_launch_date || null,
        book_publisher || null,
      ]
    );

    res.status(201).json({
      book_id: result.insertId,
      book_name,
      book_cat_id: book_cat_id || null,
      book_collection_id: book_collection_id || null,
      book_launch_date: book_launch_date || null,
      book_publisher: book_publisher || null,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /book/:id — update book details
router.put('/:id', async (req, res, next) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const {
      book_name,
      book_cat_id,
      book_collection_id,
      book_launch_date,
      book_publisher,
    } = req.body;

    const [existing] = await pool.query(
      'SELECT * FROM book WHERE book_id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await pool.query(
      `UPDATE book SET 
        book_name = ?, 
        book_cat_id = ?, 
        book_collection_id = ?, 
        book_launch_date = ?, 
        book_publisher = ?
      WHERE book_id = ?`,
      [
        book_name || existing[0].book_name,
        book_cat_id !== undefined ? book_cat_id : existing[0].book_cat_id,
        book_collection_id !== undefined ? book_collection_id : existing[0].book_collection_id,
        book_launch_date || existing[0].book_launch_date,
        book_publisher || existing[0].book_publisher,
        id,
      ]
    );

    const [updated] = await pool.query(
      `SELECT b.*, c.cat_name, c.sub_cat_name, col.collection_name
       FROM book b
       LEFT JOIN category c ON b.book_cat_id = c.cat_id
       LEFT JOIN collection col ON b.book_collection_id = col.collection_id
       WHERE b.book_id = ?`,
      [id]
    );
    res.json(updated[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
