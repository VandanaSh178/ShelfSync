import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    borrowDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
      index: true, // 🚀 useful for overdue queries
    },

    returnDate: {
      type: Date,
      default: null,
    },

    returned: {
      type: Boolean,
      default: false,
      index: true,
    },

    fine: {
      type: Number,
      default: 0,
      min: 0,
    },

    finePaid: {
      type: Boolean,
      default: false, // 💳 future payment feature
    },

    notified: {
      type: Boolean,
      default: false,
      index: true, // 📧 for cron jobs
    },
  },
  {
    timestamps: true,
  }
);


// 🚀 Prevent duplicate active borrow
borrowSchema.index(
  { user: 1, book: 1, returned: 1 },
  { unique: true, partialFilterExpression: { returned: false } }
);


// 🚀 Auto-set returnDate when returned
borrowSchema.pre("save", function (next) {
  if (this.isModified("returned") && this.returned === true) {
    this.returnDate = new Date();
  }
  next();
});

export const Borrow = mongoose.model("Borrow", borrowSchema);