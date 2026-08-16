import mongoose from "mongoose";

/**
 * Appointment schema — the shape of one booking saved in MongoDB.
 * Server-side validation mirrors the client form so bad data never lands
 * in the database, even if someone bypasses the browser.
 */
const AppointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian mobile number"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },
    visitType: {
      type: String,
      required: [true, "Visit type is required"],
      enum: ["Home Visit"], // clinic visits not offered currently
    },
    date: {
      type: String, // stored as YYYY-MM-DD from the form
      required: [true, "Preferred date is required"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    reminderSent: {
      type: Boolean,
      default: false, // used by the 24hr reminder cron job
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

// Reuse the model if it's already been compiled (Next.js hot reload safe).
export default mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);
