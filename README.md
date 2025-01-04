# Automated GST Invoicing System

## Overview

This project automates the generation of Goods and Services Tax (GST) invoices based on the status of booking documents in Firebase Firestore. The system listens for changes in the `status` field of the documents in the `bookings` collection and triggers a Cloud Function when the status changes to `"finished"`. The Cloud Function then calculates the GST components (CGST, SGST, IGST) and updates the Firestore document with the calculated GST details.

## Features

- **Firestore Triggers**: Listens for updates to documents in the `bookings` collection.
- **GST Calculation**: Calculates GST based on predefined rates and logic.
- **Taxable Value and Gross Price Calculation**: Computes the taxable value and gross price including GST.

---

## Prerequisites

Before setting up the project, ensure that you have:

- A Firebase project with Firestore and Cloud Functions enabled.
- Node.js (preferably version 18 or higher).

---

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/seeker812/question2.git
```

### 2. Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```

### 3. Initialize Firebase Project

If you haven't already initialized Firebase, run the following command and follow the prompts:

```bash
firebase init
```

Choose the following services:

- Firestore
- Functions

### 4. Configure Firestore Rules (Optional)

You can skip this step if Firestore rules are already set up. Otherwise, set up Firestore rules for security in your Firebase project.

### 5. Deploy Cloud Functions

Once the setup is complete, deploy the Cloud Functions to Firebase:

```bash
firebase deploy --only functions
```

---

## Cloud Function Workflow

The Firestore Cloud Function is triggered when a document in the `bookings` collection is updated and the `status` field changes to `"finished"`. The Cloud Function performs the following steps:

1. **Retrieve Data**: It fetches the relevant data from the updated document, including `amount`, `gstrate`, and `intra`.
2. **GST Calculation**: Based on the retrieved values, it calculates the GST components: CGST, SGST, and IGST using the `calculateGST` function.

---

## Code Structure

- **`index.js`**: Contains the main Cloud Function that listens to Firestore document changes and updates the document with GST calculations.
- **`utils/gstCalculator.js`**: A separate utility function that contains the GST calculation logic based on transaction details.

---

## Firestore Document Structure

Each document in the `bookings` collection contains the following fields:

- **name** (string): Name of the person making the booking.
- **totalBookingAmount** (number): The total amount for the booking.
- **status** (string): Status of the booking, such as `"pending"` or `"finished"`.
- **gstRate** (number): GST rate for the transaction (e.g., 18%).
- **isIntrastate** (boolean): Whether the transaction is intrastate (same state) or interstate (different states).

### Example Document (Before Cloud Function Runs):

```json
{
  "name": "John Doe",
  "amount": 5000,
  "status": "finished",
  "gstrate": 18,
  "isIntrastate": true
}
```

After the Cloud Function runs, the document will be updated with the following additional fields:

- **CGST** (number): Central GST amount.
- **SGST** (number): State GST amount.
- **IGST** (number): Integrated GST amount.
- **GSTAmount** (number): Total GST amount.

### Example Document (After Cloud Function Runs):

```json
{
  "CGST": 450,
  "SGST": 450,
  "IGST": 0,
  "GSTAmount": 900
}
```

---

## Testing the System

1. **Create/Update Firestore Document**:
   - In the Firestore console, create or update a document in the `bookings` collection with the following fields:
     - `name`: "John Doe"
     - `amount`: 5000
     - `status`: "finished"
     - `gstrate`: 18
     - `intra`: true
2. **Trigger Cloud Function**:
   - When the document’s `status` changes to `"finished"`, the Cloud Function will automatically trigger.
3. **Verify the Document**:
   - After the function runs, we can see in the console `CGST`, `SGST`, `IGST`, `GSTAmount`.

---

## Conclusion

The Automated GST Invoicing System simplifies the process of calculating and storing GST details based on the status of bookings in Firestore. When the booking status changes to `"finished"`, the system automatically calculates the applicable GST and updates the document, saving time and ensuring accurate tax calculations.

---
