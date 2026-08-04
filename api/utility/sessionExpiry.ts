import cron from "node-cron";
import Session from "../models/session.model";

const sessionExpiryJob = async () => {
    try {
        const result = await Session.updateMany(
            {
                endDateTime: { $lt: new Date() },
                status: "active"
            },
            {
                $set: {
                    status: "inactive"
                }
            }
        );
        if (result.modifiedCount > 0) { console.log("Expired sessions deactivated!") };
    } catch (err) {
        console.error(err)
    }
}

export const startSessionExpiryJob = async () => {
    await sessionExpiryJob();
    cron.schedule("0 0 * * * ", async () => {
        await sessionExpiryJob();
    });
};