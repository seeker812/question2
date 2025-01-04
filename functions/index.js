import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { calculateGST } from "./utils/gstCalculator.js";

export const processGSTInvoice = onDocumentUpdated(
  "bookings/{docId}",
  (event) => {
    const before = event.data.before?.data();
    const after = event.data.after?.data();

    if (!after) return null;

    if (before?.status !== "finished" && after.status === "finished") {
      const transactionValue = after.amount;
      if (!transactionValue) return null;

      const gstRate = after.gstrate ?? 18;
      const isIntrastate = after.intra ?? true;

      const gstDetails = calculateGST(transactionValue, gstRate, isIntrastate);

      /// --- here we can call the gst api filing

      console.log(gstDetails);
    }

    return Promise.resolve();
  }
);
