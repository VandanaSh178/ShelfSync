import cron from "node-cron";
import { sendEmail } from "../utils/sendEmail.js";
import { Borrow } from "../models/borrowModel.js";
import User from "../models/userModel.js";
import { Book } from "../models/bookModel.js";

export const notifyUsers = () => {
  // ⏰ Runs every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    try {
      console.log("⏰ Running overdue reminder job...");

      const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // ✅ Correct query
      const borrowers = await Borrow.find({
        dueDate: { $lte: oneDayFromNow },
        returned: false,
        notified: false,
      }).populate("user").populate("book");

      for (const record of borrowers) {
        if (!record.user || !record.book) continue;

        const user = record.user;
        const book = record.book;

        // ✅ Send email
        await sendEmail({
          email: user.email,
          subject: "📚 Book Due Reminder - ShelfSync",
          message: `
Hello ${user.name},

This is a reminder that your borrowed book:

📖 "${book.title}" by ${book.author}

is due on: ${record.dueDate.toDateString()}

Please return it on time to avoid late fees.

Thanks,
ShelfSync Team
          `,
        });

        // ✅ Mark as notified
        record.notified = true;
        await record.save();
        console.log(`✅ Reminder sent to ${user.email} for "${book.title}"`);
      }

      console.log(`✅ Notifications sent: ${borrowers.length}`);
    } catch (error) {
      console.error("❌ Error in cron job:", error);
    }
  });
};