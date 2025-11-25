const setPackageModel = require("../models/setPackageModel");

// สร้าง SetPackage ใหม่
exports.createSetPackage = async (req, res) => {
  try {
    const { price, menus, maxSelect, extraMenuPrice } = req.body;

    if (!price) {
      return res.status(400).json({ message: "Package price is required" });
    }

    // ตรวจสอบว่า price ซ้ำไหม
    const exists = await setPackageModel.findOne({ price });
    if (exists) {
      return res.status(400).json({ message: "Package price already exists" });
    }

    // สร้าง package
    const setPackage = await setPackageModel.create({
      price,
      menus,
      maxSelect,
      extraMenuPrice,
    });

    res.status(201).json({ message: "SetPackage created successfully", data: setPackage });
  } catch (error) {
    console.error("createSetPackage Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// อ่าน SetPackage ทั้งหมด
exports.getAllSetPackages = async (req, res) => {
  try {
    const packages = await setPackageModel.find()
      .populate("menus"); // แสดงรายละเอียด menu ด้วย
    res.status(200).json(packages);
  } catch (error) {
    console.error("getAllSetPackages Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// อ่าน SetPackage ตาม ID
exports.getSetPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const setPackage = await setPackageModel.findById(id).populate("menus");
    if (!setPackage) {
      return res.status(404).json({ message: "SetPackage not found" });
    }
    res.status(200).json(setPackage);
  } catch (error) {
    console.error("getSetPackageById Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// อัปเดต SetPackage
exports.updateSetPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const setPackage = await setPackageModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!setPackage) {
      return res.status(404).json({ message: "SetPackage not found" });
    }

    res.status(200).json({ message: "SetPackage updated", data: setPackage });
  } catch (error) {
    console.error("updateSetPackage Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ลบ SetPackage
exports.deleteSetPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const setPackage = await setPackageModel.findByIdAndDelete(id);
    if (!setPackage) {
      return res.status(404).json({ message: "SetPackage not found" });
    }
    res.status(200).json({ message: "SetPackage deleted successfully" });
  } catch (error) {
    console.error("deleteSetPackage Error:", error);
    res.status(500).json({ message: error.message });
  }
};
