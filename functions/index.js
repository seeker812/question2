import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { calculateGST } from "./utils/gstCalculator.js";
import { admin } from "./firebase.js";

export const processGSTInvoice = onDocumentUpdated(
  "bookings/{docId}",
  async (event) => {
    const before = event.data.before?.data();
    const after = event.data.after?.data();

    if (!after) return null;

    if (before?.status !== "finished" && after.status === "finished") {
      const transactionValue = after.amount;
      if (!transactionValue) return null;

      const gstRate = after.gstrate ?? 18;
      const isIntrastate = after.intra ?? true;

      const gstDetails = calculateGST(transactionValue, gstRate, isIntrastate);

      try {
        /// ---- Here we are storing the field gst whenever status are changed
        await admin
          .firestore()
          .collection("bookings")
          .doc(event.params.docId)
          .update({
            CGST: gstDetails.CGST,
            SGST: gstDetails.SGST,
            IGST: gstDetails.IGST,
          });
        console.log("GST details updated in Firestore document.");

        // ----- This is the MOCK -API of gstfilling
        /*
        const gstData = {
            name: after.name || 'Unknown',
            ...gstDetails,
        };

        const response = await axios.post('https://api.example.com/gst/invoice', gstData, {
            headers: {
                'Authorization': `Bearer YOUR_API_KEY`, // Replace with your actual API key
                'Content-Type': 'application/json',
            },
        });

        console.log('GST API Response:', response.data);
        
        */
      } catch (error) {
        console.error("Error processing GST or updating Firestore:", error);
      }
    }

    return Promise.resolve();
  }
);
