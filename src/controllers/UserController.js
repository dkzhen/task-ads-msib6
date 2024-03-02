const { Op } = require("sequelize");
const Provider = require("../provider/DatabaseProvider");
const { createJWT } = require("../utils/jwt");
const { generateOTP } = require("../utils/otp");
const { decrypt } = require("../utils/bcrypt");
const { deleteFile } = require("../utils/multer");
const UserModel = Provider.UserModel;
const OTPModel = Provider.OTPModel;

exports.register = async (req, res) => {
  try {
    const { email, name, phone, password } = req.body;

    if (!name) {
      return res.status(400).json({
        errors: ["validation error"],
        message: "name is required",
        data: null,
      });
    }
    if (!password) {
      return res.status(400).json({
        errors: ["validation error"],
        message: "Password is required",
        data: null,
      });
    }
    if (!email && !phone) {
      return res.status(400).json({
        errors: ["validation error"],
        message: "Email or phone is required",
        data: null,
      });
    }
    if (email) {
      if ((await UserModel.findOne({ where: { email: email } })) !== null) {
        return res.status(400).json({
          errors: ["validation error"],
          message: "Email exists",
          data: null,
        });
      }
    }
    if (phone) {
      if ((await UserModel.findOne({ where: { phone: phone } })) !== null) {
        return res.status(400).json({
          errors: ["validation error"],
          message: "Phone exists",
          data: null,
        });
      }
    }
    // tes register
    const newUser = await UserModel.create({
      email,
      name,
      phone,
      password,
    });

    return res.status(201).json({
      errors: [],
      message: "User created successfully",
      data: [
        {
          userId: newUser.userId,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
        },
      ],
    });
  } catch (error) {
    return res.status(500).json({
      errors: [error.message],
      message: "Internal error occurred while creating",
      data: null,
    });
  }
};

exports.generateOTPRequest = async (req, res) => {
  const { phone } = req.body;

  try {
    if (!phone) {
      return res.status(400).json({
        errors: ["Validation error"],
        message: "Phone is required",
        data: null,
      });
    }

    const otpExist = await OTPModel.findOne({ where: { phone: phone } });

    if (otpExist !== null) {
      await OTPModel.destroy({ where: { phone: phone } });
    }

    const otpCode = generateOTP();
    const newOtp = await OTPModel.create({
      phone: phone,
      code: otpCode,
    });

    return res.status(201).json({
      errors: [],
      message: "Otp created successfully",
      data: [
        {
          phone: newOtp.phone,
          otpCode: newOtp.code,
        },
      ],
    });
  } catch (error) {
    return res.status(500).json({
      errors: [error.message],
      message: "Internal error occurred while creating",
      data: null,
    });
  }
};
exports.verifyOTPRequest = async (req, res) => {
  try {
    const { phone, code } = req.body;

    const data = await OTPModel.findOne({
      where: {
        phone: phone,
      },
    });

    if (phone && code) {
      if (phone === data.phone && code == data.code) {
        await OTPModel.destroy({ where: { phone: data.phone } });
        return res.status(200).json({
          errors: [],
          message: "Verification successful",
          data: [{ phone: data.phone, code: data.code }],
        });
      }
      return res.status(400).json({
        errors: ["something went wrong"],
        message: "Verification failed",
        data: null,
      });
    } else {
      return res.status(400).json({
        errors: ["Validation error"],
        message: "phone or code is required",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      errors: [error.message],
      message: "Internal error occurred while creating",
      data: null,
    });
  }
};
exports.login = async (req, res) => {
  const { email, phone, password } = req.body;
  try {
    if (!password) {
      return res.status(400).json({
        errors: ["validation error"],
        message: "Password is required",
        data: null,
      });
    }
    let conditions;
    if (email) {
      conditions = { email: email };
    } else if (phone) {
      conditions = { phone: phone };
    }
    const user = await UserModel.findOne({
      where: {
        [Op.or]: [conditions],
      },
    });
    if (!user) {
      return res.status(404).json({
        errors: ["Not Found"],
        message: "User not found",
        data: null,
      });
    }
    //compare bcrypt
    const isValidPassword = decrypt(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        errors: ["Unauthorized"],
        message: "Invalid password",
        data: null,
      });
    }

    // tes generate jwt
    const token = createJWT(user.userId);
    return res.status(200).json({
      errors: [],
      message: "Login successful",
      data: [
        {
          userId: user.userId,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
        {
          "jwt Token": token,
        },
      ],
    });
  } catch (error) {
    return res.status(500).json({
      errors: [error.message],
      message: "Internal error occurred while creating",
      data: null,
    });
  }
};
exports.updatePhotoProfile = async (req, res) => {
  const { userId } = req.params;
  if (!req.file) {
    return res.status(400).json({
      errors: ["Bad Request"],
      message: "File is required",
      data: null,
    });
  }
  const image = req.file.path;
  try {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      deleteFile(image);
      return res.status(404).json({
        errors: ["Not Found"],
        message: "User not found",
        data: null,
      });
    }

    await UserModel.update(
      {
        image: image,
      },
      { where: { userId: userId } }
    );
    return res.status(200).json({
      errors: [],
      message: "Photo updated successfully",
      data: [
        {
          imagePath: image,
        },
      ],
    });
  } catch (error) {
    return res.status(500).json({
      errors: [error.message],
      message: "Internal error occurred while creating",
      data: null,
    });
  }
};
