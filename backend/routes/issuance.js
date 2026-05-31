const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// IMPORTANT: /pending/today MUST come before /:id
// Otherwise Express matches "pending" as an :id parameter

// GET /issuance/pending/today — all pending issuances for dashboard
router.get('/pending/today', async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT 
        i.issuance_id,
        m.mem_name,
        b.book_name,
        i.issuance_date,
        i.target_return_date,
        i.issuance_status,
        i.issued_by
      FROM issuance i
      JOIN member m ON i.issuance_member = m.mem_id
      JOIN book b ON i.book_id = b.book_id
      WHERE i.issuance_status = 'pending'
      ORDER BY i.target_return_date ASC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /issuance — all issuances with member and book names
router.get('/', async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT 
        i.issuance_id,
        i.book_id,
        i.issuance_date,
        i.issuance_member,
        i.issued_by,
        i.target_return_date,
        i.issuance_status,
        m.mem_name,
        b.book_name
      FROM issuance i
      JOIN member m ON i.issuance_member = m.mem_id
      JOIN book b ON i.book_id = b.book_id
      ORDER BY i.issuance_date DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /issuance/:id — single issuance with full details
router.get('/:id', async (req, res, next) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT 
        i.issuance_id,
        i.book_id,
        i.issuance_date,
        i.issuance_member,
        i.issued_by,
        i.target_return_date,
        i.issuance_status,
        m.mem_name,
        m.mem_phone,
        m.mem_email,
        b.book_name,
        b.book_publisher,
        c.cat_name,
        col.collection_name
      FROM issuance i
      JOIN member m ON i.issuance_member = m.mem_id
      JOIN book b ON i.book_id = b.book_id
      LEFT JOIN category c ON b.book_cat_id = c.cat_id
      LEFT JOIN collection col ON b.book_collection_id = col.collection_id
      WHERE i.issuance_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Issuance not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /issuance — create new issuance
router.post('/', async (req, res, next) => {
  try {
    const pool = getPool();
    const {
      book_id,
      issuance_member,
      issued_by,
      target_return_date,
      issuance_status,
    } = req.body;

    if (!book_id || !issuance_member || !target_return_date) {
      return res.status(400).json({
        error: 'book_id, issuance_member, and target_return_date are required',
      });
    }

    const [result] = await pool.query(
      `INSERT INTO issuance 
        (book_id, issuance_date, issuance_member, issued_by, target_return_date, issuance_status)
       VALUES (?, NOW(), ?, ?, ?, ?)`,
      [
        book_id,
        issuance_member,
        issued_by || null,
        target_return_date,
        issuance_status || 'pending',
      ]
    );

    res.status(201).json({
      issuance_id: result.insertId,
      book_id,
      issuance_member,
      issued_by: issued_by || null,
      target_return_date,
      issuance_status: issuance_status || 'pending',
    });
  } catch (err) {
    next(err);
  }
});

// PUT /issuance/:id — update issuance (mainly to mark as returned)
router.put('/:id', async (req, res, next) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { issuance_status, target_return_date, issued_by } = req.body;

    const [existing] = await pool.query(
      'SELECT * FROM issuance WHERE issuance_id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Issuance not found' });
    }

    await pool.query(
      `UPDATE issuance SET 
        issuance_status = ?, 
        target_return_date = ?, 
        issued_by = ?
      WHERE issuance_id = ?`,
      [
        issuance_status || existing[0].issuance_status,
        target_return_date || existing[0].target_return_date,
        issued_by || existing[0].issued_by,
        id,
      ]
    );

    const [updated] = await pool.query(
      `SELECT i.*, m.mem_name, b.book_name
       FROM issuance i
       JOIN member m ON i.issuance_member = m.mem_id
       JOIN book b ON i.book_id = b.book_id
       WHERE i.issuance_id = ?`,
      [id]
    );
    res.json(updated[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
