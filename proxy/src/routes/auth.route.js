require("dotenv").config();

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users.model");

router.post("/register", async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password)
            return res.status(400).json({ success: false, message: "Missing fields." });

        const exist = await User.findOne({ email });

        if (exist)
            return res.status(409).json({ success: false, message: "Email already exists." });

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullname,
            email,
            password: hash
        });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(401).json({ success: false, message: "Invalid credentials." });

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            return res.status(401).json({ success: false, message: "Invalid credentials." });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/me", async (req, res) => {
    try {
        const auth = req.headers.authorization;

        if (!auth)
            return res.status(401).json({ success: false });

        const token = auth.split(" ")[1];

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.id).select("-password");

        if (!user)
            return res.status(404).json({ success: false });

        res.json({
            success: true,
            user
        });

    } catch (error) {
        res.status(401).json({ success: false });
    }
});

module.exports = router;