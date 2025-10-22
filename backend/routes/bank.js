const express = require("express");
const db = require("../database/db");
const router = express.Router();

// Register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  db.run("INSERT INTO users (name, email, balance, password) VALUES (?, ?, ?, ?)",
    [name, email, 1000, password],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
    if (err || !row) return res.status(401).json({ error: "Invalid credentials" });
    res.json(row);
  });
});

// Get Balance
router.get("/balance/:email", (req, res) => {
  db.get("SELECT balance FROM users WHERE email = ?", [req.params.email], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "User not found" });
    res.json(row);
  });
});

// Transfer Funds
router.post("/transfer", (req, res) => {
  const { sender, receiver, amount } = req.body;
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.get("SELECT balance FROM users WHERE email = ?", [sender], (err, senderRow) => {
      if (err || senderRow.balance < amount) {
        db.run("ROLLBACK");
        return res.status(400).json({ error: "Insufficient funds" });
      }

      db.run("UPDATE users SET balance = balance - ? WHERE email = ?", [amount, sender]);
      db.run("UPDATE users SET balance = balance + ? WHERE email = ?", [amount, receiver]);

      db.run("INSERT INTO transactions (sender, receiver, amount) VALUES (?, ?, ?)", [sender, receiver, amount]);
      db.run("COMMIT");
      res.json({ success: true });
    });
  });
});

// Transaction History
router.get("/transactions/:email", (req, res) => {
  db.all("SELECT * FROM transactions WHERE sender = ? OR receiver = ? ORDER BY timestamp DESC", [req.params.email, req.params.email], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
