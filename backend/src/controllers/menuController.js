const menuModel = require("../models/menuModel")

exports.createMenu = async (req, res) => {
  try {
    const { code, name, description, category, price, packagePrice, image, tags } = req.body;

    const exists = await menuModel.findOne({ code: code.toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: "Menu code already exists" });
    }

    const menu = await menuModel.create({
      code: code.toUpperCase(),
      name,
      description,
      category,
      price,
      packagePrice,
      image,
      tags,
    });

    res.status(201).json({ message: "Menu created successfully", data: menu });
  } catch (error) {
    console.error("createMenu Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// 📌 ดึงเมนูทั้งหมด + filter
exports.getAllMenus = async (req, res) => {
  try {
    const { search, category, active, tag } = req.query;

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (active !== undefined) {
      filter.active = active === "true";
    }

    if (tag) {
      filter.tags = tag;
    }

    const menus = await menuModel.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ count: menus.length, data: menus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 ดึงเมนูเดียว
exports.getMenuById = async (req, res) => {
  try {
    const menu = await menuModel.findById(req.params.id);

    if (!menu) return res.status(404).json({ message: "Menu not found" });

    res.status(200).json({ data: menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 อัปเดตเมนู
exports.updateMenu = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedMenu = await menuModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json({
      message: "Menu updated successfully",
      data: updatedMenu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 ลบเมนู (hard delete)
exports.deleteMenu = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await menuModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json({ message: "Menu deleted successfully", data: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 soft delete (เปลี่ยน active)
exports.toggleActive = async (req, res) => {
  try {
    const id = req.params.id;

    const menu = await menuModel.findById(id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    menu.active = !menu.active;
    await menu.save();

    res.status(200).json({
      message: `Menu is now ${menu.active ? "active" : "inactive"}`,
      data: menu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
