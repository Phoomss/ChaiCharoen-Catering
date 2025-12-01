const menuPackageModel = require("../models/menuPackageModel");

// สร้าง MenuPackage ใหม่
exports.createMenuPackage = async (req, res) => {
  try {
    const { price, menus, maxSelect, extraMenuPrice } = req.body;

    if (!price) {
      return res.status(400).json({ message: "Package price is required" });
    }

    // ตรวจสอบว่า price ซ้ำไหม
    const exists = await menuPackageModel.findOne({ price });
    if (exists) {
      return res.status(400).json({ message: "Package price already exists" });
    }

    // สร้าง package
    const menuPackage = await menuPackageModel.create({
      price,
      menus,
      maxSelect,
      extraMenuPrice,
    });

    res.status(201).json({ message: "MenuPackage created successfully", data: menuPackage });
  } catch (error) {
    console.error("createMenuPackage Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// อ่าน MenuPackage ทั้งหมด
exports.getAllMenuPackages = async (req, res) => {
  try {
    const packages = await menuPackageModel.find()
      .populate("menus"); // แสดงรายละเอียด menu ด้วย
    res.status(200).json(packages);
  } catch (error) {
    console.error("getAllMenuPackages Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// อ่าน MenuPackage ตาม ID
exports.getMenuPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuPackage = await menuPackageModel.findById(id).populate("menus");
    if (!menuPackage) {
      return res.status(404).json({ message: "MenuPackage not found" });
    }
    res.status(200).json(menuPackage);
  } catch (error) {
    console.error("getMenuPackageById Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// อัปเดต MenuPackage
exports.updateMenuPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const menuPackage = await menuPackageModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!menuPackage) {
      return res.status(404).json({ message: "MenuPackage not found" });
    }

    res.status(200).json({ message: "MenuPackage updated", data: menuPackage });
  } catch (error) {
    console.error("updateMenuPackage Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ลบ MenuPackage
exports.deleteMenuPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const menuPackage = await menuPackageModel.findByIdAndDelete(id);
    if (!menuPackage) {
      return res.status(404).json({ message: "MenuPackage not found" });
    }
    res.status(200).json({ message: "MenuPackage deleted successfully" });
  } catch (error) {
    console.error("deleteMenuPackage Error:", error);
    res.status(500).json({ message: error.message });
  }
};
