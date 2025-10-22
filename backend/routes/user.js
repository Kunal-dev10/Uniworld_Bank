const express = require("express");
const db = require("../database/db");
const router = express.Router();

// Get user profile
router.get("/:email", (req, res) => {
  const { email } = req.params;
  db.get("SELECT name, email FROM users WHERE email = ?", [email], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "User not found" });
    res.json(row);
  });
});

// Update profile (name/password)
router.post("/update", (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name)
    return res.status(400).json({ error: "Name and email required" });

  const query = password
    ? "UPDATE users SET name = ?, password = ? WHERE email = ?"
    : "UPDATE users SET name = ? WHERE email = ?";
  const params = password ? [name, password, email] : [name, email];

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: "Update failed" });
    res.json({ success: true });
  });
});

module.exports = router;
