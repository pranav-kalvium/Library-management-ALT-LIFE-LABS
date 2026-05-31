const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /member — all members with membership status
router.get('/', async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT 
        m.mem_id,
        m.mem_name,
        m.mem_phone,
        m.mem_email,
        ms.status AS membership_status
      FROM member m
      LEFT JOIN membership ms ON m.mem_id = ms.member_id
      ORDER BY m.mem_id
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /member/:id — single member with issuance history
router.get('/:id', async (req, res, next) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const [members] = await pool.query(
      `SELECT 
        m.mem_id,
        m.mem_name,
        m.mem_phone,
        m.mem_email,
        ms.status AS membership_status
      FROM member m
      LEFT JOIN membership ms ON m.mem_id = ms.member_id
      WHERE m.mem_id = ?`,
      [id]
    );

    if (members.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const [issuances] = await pool.query(
      `SELECT 
        i.issuance_id,
        b.book_name,
        i.issuance_date,
        i.target_return_date,
        i.issuance_status,
        i.issued_by
      FROM issuance i
      JOIN book b ON i.book_id = b.book_id
      WHERE i.issuance_member = ?
      ORDER BY i.issuance_date DESC`,
      [id]
    );

    res.json({ ...members[0], issuances });
  } catch (err) {
    next(err);
  }
});

// POST /member — create new member (auto-creates membership)
router.post('/', async (req, res, next) => {
  try {
    const pool = getPool();
    const { mem_name, mem_phone, mem_email } = req.body;

    if (!mem_name) {
      return res.status(400).json({ error: 'mem_name is required' });
    }

    const [memberResult] = await pool.query(
      'INSERT INTO member (mem_name, mem_phone, mem_email) VALUES (?, ?, ?)',
      [mem_name, mem_phone || null, mem_email || null]
    );

    const memberId = memberResult.insertId;

    // Auto-create membership with active status
    await pool.query(
      'INSERT INTO membership (member_id, status) VALUES (?, ?)',
      [memberId, 'active']
    );

    res.status(201).json({
      mem_id: memberId,
      mem_name,
      mem_phone: mem_phone || null,
      mem_email: mem_email || null,
      membership_status: 'active',
    });
  } catch (err) {
    next(err);
  }
});

// PUT /member/:id — update member details
router.put('/:id', async (req, res, next) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { mem_name, mem_phone, mem_email } = req.body;

    const [existing] = await pool.query(
      'SELECT * FROM member WHERE mem_id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await pool.query(
      'UPDATE member SET mem_name = ?, mem_phone = ?, mem_email = ? WHERE mem_id = ?',
      [
        mem_name || existing[0].mem_name,
        mem_phone || existing[0].mem_phone,
        mem_email || existing[0].mem_email,
        id,
      ]
    );

    const [updated] = await pool.query(
      'SELECT * FROM member WHERE mem_id = ?',
      [id]
    );
    res.json(updated[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
