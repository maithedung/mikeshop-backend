import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },
    googleId: {
      type: String
    },
    ascii: {
      type: String
    },
    hex: {
      type: String
    },
    base32: {
      type: String
    },
    otpauth_url: {
      type: String
    },
    otp_enabled: {
      type: Boolean,
      default: false
    },
    otp_verified: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
  },
  {
    timestamps: true
  });

// LOGIN
userSchema.methods.matchPassword = async function(enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// REGISTER
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
