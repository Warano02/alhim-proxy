const bcrypt = require("bcryptjs");
const User = require("../models/users.model");

async function seedAdmin() {
    try {
        const exist = await User.findOne({ email: "carineteoi@gmail.com" });

        if (exist) return;

        const password = await bcrypt.hash("123456789", 10);

        await User.create({
            fullname: "Felix Warano",
            email: "carineteoi@gmail.com",
            password,
            role: "admin"
        });

        console.log("Default admin created.");
    } catch (error) {
        console.error("Admin seed failed:", error.message);
    }
}

module.exports = seedAdmin;