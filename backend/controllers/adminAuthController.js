const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
    try {

        const { email, password, fullName, phoneNumber, role } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const newAdmin = new Admin({
            email,
            password,
            fullName,
            phoneNumber,
            role,
        });

        await newAdmin.save();

        res.status(201).json({ message: "Admin created successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: admin.role, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.json({ message: "Login successful", token, admin });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}