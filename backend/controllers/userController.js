const User = require("../models/User");

exports.getLeetcodeUsername = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("leetcodeUsername");
    res.status(200).json({ username: user?.leetcodeUsername || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLeetcodeUsername = async (req, res) => {
  try {
    const { username } = req.body;
    await User.findByIdAndUpdate(
      req.user._id,
      { leetcodeUsername: username },
      { new: true },
    );
    res.status(200).json({ username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
