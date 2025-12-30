const db = require("../db/authdb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

/* ================= VALIDATION SCHEMA ================= */
const schema = Joi.object({
  username: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  age: Joi.number().min(1).max(120).required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().length(10).required(),
  address: Joi.string().required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  password: Joi.string().min(5).required()
});

/* ================= SIGNUP ================= */
exports.signup = async (req, res) => {
  try {
    // 1️⃣ Validate form fields (image excluded)
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // 3️⃣ Create user document (WITHOUT image)
    const userDoc = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      age: Number(req.body.age),
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address,
      gender: req.body.gender,
      password: hashedPassword
    };

    const response = await db.insert(userDoc);

    // 4️⃣ Store image as CouchDB attachment
    if (req.file) {
      await db.attachment.insert(
        response.id,           // document ID
        req.file.originalname, // file name
        req.file.buffer,       // file data
        req.file.mimetype,     // MIME type
        { rev: response.rev }  // document revision
      );
    }

    res.json({ message: "Signup success" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await db.find({ selector: { username } });

    if (!result.docs.length) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.docs[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,   // true in HTTPS
      sameSite: "strict",
      maxAge: 60 * 60 * 1000
    });

    res.json({ message: "Login successful" });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= GET ALL SIGNUP USERS ================= */
exports.getSignupUsers = async (req, res) => {
  try {
    const result = await db.list({ include_docs: true });

    const users = result.rows.map(row => ({
      id: row.doc._id,
      username: row.doc.username,
      firstname: row.doc.firstname,
      lastname: row.doc.lastname,
      age: row.doc.age,
      email: row.doc.email,
      mobile: row.doc.mobile,
      address: row.doc.address,
      gender: row.doc.gender
      // password & attachments excluded
    }));

    res.status(200).json(users);

  } catch (err) {
    console.error("Fetch signup users error:", err);
    res.status(500).json({ message: "Failed to fetch signup users" });
  }
};

/* ================= LOGOUT ================= */
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};
