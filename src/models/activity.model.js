import mongoose from "mongoose";

// Activity Schema to log user actions and system events for auditing and monitoring purposes
const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "CREATE_VENDOR",
        "UPDATE_VENDOR",
        "DELETE_VENDOR",
        "CREATE_INVENTORY",
        "UPDATE_INVENTORY",
        "DELETE_INVENTORY",
        "CREATE_USER",
        "LOGIN_USER",
        "LOGOUT_USER",
        "CHANGE_PASSWORD",
        "UPDATE_USER_AVATAR",
        "UPDATE_USER_ROLE",
        "DELETE_USER"
      ]
    },

    entityType: {
      type: String,
      enum: ["Vendor", "Inventory", "User"],
      required: true
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// create and export Activity model
export const Activity = mongoose.model("Activity", activitySchema);
