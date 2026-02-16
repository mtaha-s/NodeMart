import { Activity } from "../models/activity.model.js";

// Utility function to log activities in the system for auditing and monitoring purposes
const logActivity = async ({
  action,
  entityType,
  entityId,
  message,
  userId
}) => {
  await Activity.create({
    action,
    entityType,
    entityId,
    message,
    performedBy: userId
  });
};

// Export the logActivity function for use in controllers and other parts of the application
export { logActivity };