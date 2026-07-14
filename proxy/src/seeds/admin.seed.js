const bcrypt = require("bcryptjs");
const User = require("../models/users.model");

const users = [
    {
        email: "carineteoi@gmail.com",
        name: "Felix Warano",
        password: "123456789"
    },
    {
        email: "abdoulhalim610@gmail.com",
        name: "Abdoul Halim",
        password: "123456789"
    },
]

async function seedAdmin() {
    try {
        for (const user of users) {
            const exist = await User.findOne({ email: user.email });

            if (!exist) {
                const password = await bcrypt.hash(user.password, 10);

                await User.create({
                    fullname: user.name,
                    email: user.email,
                    password,
                    role: "admin"
                });

                console.log(user.name + " default admin created....");
            }

        }
    } catch (error) {
        console.error("Admin seed failed:", error.message);
    }
}

module.exports = seedAdmin;