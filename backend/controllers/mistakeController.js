const Mistake = require("../models/Mistake");

exports.createMistake = async (req, res) => {
  try {
    const mistake = await Mistake.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(mistake);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMistakes = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const pageSize = parseInt(req.query.pageSize || "10");
    const search = req.query.search || "";

    const query = { user: req.user._id };

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [{ problemName: searchRegex }, { topic: searchRegex }];
    }

    const totalCount = await Mistake.countDocuments(query);
    const mistakes = await Mistake.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      mistakes,
      totalCount,
      page,
      pageSize,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMistake = async (req, res) => {
  try {
    const { id } = req.params;
    const { reflection } = req.body;

    if (!reflection) {
      return res.status(400).json({ error: "Reflection is required" });
    }

    const mistake = await Mistake.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { reflection },
      { new: true },
    );

    if (!mistake) {
      return res.status(404).json({ error: "Mistake not found" });
    }

    res.status(200).json(mistake);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
