process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require("express");
const router = express.Router();
const Joi = require("joi");

const db = require("../db/cruddb");

/* ================= VALIDATION SCHEMA ================= */
const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  age: Joi.number().integer().min(1).max(120).required()
});

/* ================= CREATE ================= */
router.post("/", async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    await db.insert(req.body);
    res.json({ message: "User added" });

  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
});

/* ================= READ ALL ================= */
router.get("/", async (req, res) => {
  try {
    const result = await db.list({ include_docs: true });

    const users = result.rows.map(row => ({
      id: row.doc._id,
      rev: row.doc._rev,
      name: row.doc.name,
      email: row.doc.email,
      age: row.doc.age
    }));

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= UPDATE ================= */
router.put("/:id/:rev", async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    await db.insert({
      ...req.body,
      _id: req.params.id,
      _rev: req.params.rev
    });

    res.json({ message: "Updated" });

  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

/* ================= DELETE ================= */
router.delete("/:id/:rev", async (req, res) => {
  try {
    await db.destroy(req.params.id, req.params.rev);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
