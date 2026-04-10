import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["book_added", "book_deleted", "book_borrowed", "book_returned", "overdue"],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    forRole: {
      type: String,
      enum: ["admin", "user", "all"],
      default: "all",
    },
    relatedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      default: null,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);