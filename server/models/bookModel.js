import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ["Fiction", "Non-Fiction", "Education", "Comics"],
      default: "Education",
    },
    image: {
      url: String,
      public_id: String,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Auto update availability
bookSchema.pre("save", function () {
  // console.log("✅ pre save hook running");
  this.available = this.quantity > 0;
});

export const Book = mongoose.model("Book", bookSchema);