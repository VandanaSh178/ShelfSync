import cron from 'node-cron';
import User from '../models/userModel.js';

export const removeUnverifiedAccounts = () => {
  // ⏰ Runs every hour
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("⏰ Running unverified account cleanup job...");

      // ✅ Find unverified accounts older than 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const unverifiedUsers = await User.find({
        verified: false,
        createdAt: { $lte: twentyFourHoursAgo },
      });

      // ✅ Remove unverified accounts
      for (const user of unverifiedUsers) {
        await User.deleteOne({ _id: user._id });
        console.log(`✅ Unverified account removed: ${user.email}`);
      }

      console.log(`✅ Unverified accounts cleaned up: ${unverifiedUsers.length}`);
    } catch (error) {
      console.error("❌ Error in cron job:", error);
    }
  });
};