const User = require("../model/user.model");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    console.log("Login API hit with data:", req.body); // Log request body

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: "All fields are required", status: false });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(401).json({ msg: "Incorrect Username or Password", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password attempt for:", username);
      return res.status(401).json({ msg: "Incorrect Username or Password", status: false });
    }

    // Remove password from response
    const userData = { ...user._doc };
    delete userData.password;

    console.log("Login successful for:", username);
    return res.status(200).json({ status: true, user: userData });
  } catch (ex) {
    console.error("Login Error:", ex);
    return res.status(500).json({ msg: "Internal Server Error", status: false });
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};



module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};