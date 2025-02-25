import { Schema, model, models, mongoose } from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new Schema({
  // Admin Details
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roles: {
    type: [String],
    enum: ["Admin", "Moderator"],
    default: ["Moderator"],
  },
  lastLogin: { type: Date, default: Date.now },

  // Permissions for managing other admins
  permissions: {
    canManageMods: { type: Boolean, default: false },
  },

  // User Management Responsibilities
  userManagement: {
    canManageRoles: { type: Boolean, default: true },
    canApproveArtists: { type: Boolean, default: true },
    canBanUsers: { type: Boolean, default: true },
  },

  // Content Moderation Responsibilities
  contentModeration: {
    canModeratePosts: { type: Boolean, default: true },
    canManageNFTs: { type: Boolean, default: true },
    canRemoveInappropriateContent: { type: Boolean, default: true },
  },

  // Platform Management
  platformManagement: {
    canAccessDashboard: { type: Boolean, default: true },
    canOverseeAuctions: { type: Boolean, default: true },
  },

  // Security Responsibilities
  securityManagement: {
    canReviewLoginAttempts: { type: Boolean, default: true },
    canManageAccountVerification: { type: Boolean, default: true },
  },

  // Community Management
  communityManagement: {
    canOrganizeChallenges: { type: Boolean, default: true },
    canPromoteSpotlights: { type: Boolean, default: true },
    canModerateForums: { type: Boolean, default: true },
  },

  // Reporting and Alerts
  reporting: {
    canHandleCopyrightIssues: { type: Boolean, default: true },
    canManageFlaggedContent: { type: Boolean, default: true },
  },

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Middleware for hashing passwords
AdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Static method to find admin by credentials
AdminSchema.statics.findByCredentials = async function (email, password) {
  const admin = await this.findOne({ email });
  if (!admin) throw new Error("Admin not found");
  const isPasswordMatch = await bcrypt.compare(password, admin.password);
  if (!isPasswordMatch) throw new Error("Incorrect password");
  return admin;
};

// Static method to create a Super Admin
AdminSchema.statics.createSuperAdmin = async function ({ name, email, password }) {
  const existingSuperAdmin = await this.findOne({ roles: "Super Admin" });
  if (existingSuperAdmin) {
    throw new Error("A Super Admin already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const superAdmin = new this({
    name,
    email,
    password: hashedPassword,
    roles: ["Super Admin"],
    permissions: { canManageAdmins: true },
  });

  await superAdmin.save();
  return superAdmin;
};

const Admin = models.Admin || model("Admin", AdminSchema);

export default Admin;
