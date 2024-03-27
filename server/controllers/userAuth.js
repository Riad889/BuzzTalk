const generateToken = require("../config/generateToken");

const UserSchema = require("../models/userSchema");
const bcrypt = require("bcryptjs");

const Login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email: email });

  if (user && bcrypt.compareSync(password, user.password)) {
    return res.status(201).json({
      message: "User Login Successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      },
    });
  } else {
    return res.status(405).json({ message: "Invalid credential" });
  }
};

const Register = async (req, res) => {
  console.log(req.body);
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password)
    return res.status(403).json({ message: "Enter all field" });
  else {
    try {
      const existingUser = await UserSchema.findOne({ email: email });
      if (existingUser) {
        return res.status(402).json({ message: "User is already existed" });
      } else {
        const salt = bcrypt.genSaltSync(10);

        const hassPass = bcrypt.hashSync(password, salt);
        //console.log(hassPass);
        if (pic) {
          const result = await UserSchema.create({
            name: name,
            email: email,
            password: hassPass,
            pic: pic,
          });
          return res.status(200).json({
            message: "User is created successfully",
            _id: result._id,
            name: result.name,
            email: result.email,

            pic: result.pic,
            token: generateToken(result._id),
          });
        } else {
          const result = await UserSchema.create({
            name: name,
            email: email,
            password: hassPass,
          });
          return res.status(200).json({
            message: "User is created successfully",
            _id: result._id,
            name: result.name,
            email: result.email,
            pic: result.pic,
            token: generateToken(result._id),
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
};

const getUser = async (req, res) => {
  //console.log("userId: ", req.params.id); 
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
      //console.log(keyword)
    const  result = await UserSchema.find({
      ...keyword,
      _id: { $ne: req.params.id },
    });
    //console.log(result)
    if (result) {
      return res.status(203).json({ result });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { Register, Login, getUser };
