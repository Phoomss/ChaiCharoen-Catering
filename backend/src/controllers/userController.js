const { hashPassword } = require('../helpers/hashPassword');
const userModel = require('../models/userModel');

const getUserInfo = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ data: user });

    } catch (error) {
        console.error("getUserInfo Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select("-password");
        res.status(200).json({ data: users });

    } catch (error) {
        console.error("getAllUsers Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const searchUserByRole = async (req, res) => {
    try {
        const { role } = req.query;

        if (!role) {
            return res.status(400).json({ message: "Role is required" });
        }

        const users = await userModel.find({ role }).select("-password");

        if (!users.length) {
            return res.status(404).json({ message: "No users found with this role" });
        }

        res.status(200).json({ data: users });

    } catch (error) {
        console.error("searchUserByRole Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ data: user });

    } catch (error) {
        console.error("getUserById Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { title, firstName, lastName, username, email, password, phone } = req.body;
        const userId = req.user._id;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ msg: "ไม่พบผู้ใช้" });

        if (req.body.role && req.body.role !== user.role) {
            return res.status(403).json({ msg: "คุณไม่มีสิทธิ์แก้ไข Role" });
        }

        const exists = await userModel.findOne({
            $or: [
                username ? { username } : null,
                email ? { email } : null,
                phone ? { phone } : null
            ].filter(Boolean),
            _id: { $ne: userId }
        });

        if (exists) {
            return res.status(400).json({
                msg:
                    exists.username === username
                        ? "Username นี้ถูกใช้งานแล้ว"
                    : exists.email === email
                        ? "อีเมลนี้ถูกใช้งานแล้ว"
                    : "เบอร์โทรนี้ถูกใช้งานแล้ว"
            });
        }

        const hashedPassword = password ? await hashPassword(password) : user.password;

        const updateData = {
            title: title ?? user.title,
            firstName: firstName ?? user.firstName,
            lastName: lastName ?? user.lastName,
            username: username ?? user.username,
            email: email ?? user.email,
            password: hashedPassword,
            phone: phone ?? user.phon
        };

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: "-password" }
        );

        res.status(200).json({
            msg: "อัปเดตข้อมูลผู้ใช้สำเร็จ",
            data: updatedUser
        });

    } catch (error) {
        console.error("updateProfile Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = { ...req.body };

        delete updates._id;

        if (updates.role && updates.role === "admin") {
            return res.status(403).json({ message: "ไม่สามารถตั้ง Role เป็น Admin ผ่าน API นี้ได้" });
        }

        if (updates.username || updates.email || updates.phone) {
            const exists = await userModel.findOne({
                $or: [
                    updates.username ? { username: updates.username } : null,
                    updates.email ? { email: updates.email } : null,
                    updates.phone ? { phone: updates.phone } : null
                ].filter(Boolean),
                _id: { $ne: userId }
            });

            if (exists) {
                return res.status(400).json({
                    message:
                        exists.username === updates.username
                            ? "Username นี้ถูกใช้งานแล้ว"
                        : exists.email === updates.email
                            ? "อีเมลนี้ถูกใช้งานแล้ว"
                        : "เบอร์โทรนี้ถูกใช้งานแล้ว"
                });
            }
        }

        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            updates,
            { new: true, select: "-password" }
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            message: "User updated successfully",
            data: user
        });

    } catch (error) {
        console.error("updateUser Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.error("deleteUser Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getUserInfo,
    getAllUsers,
    searchUserByRole,
    getUserById,
    updateProfile,
    updateUser,
    deleteUser,
};
