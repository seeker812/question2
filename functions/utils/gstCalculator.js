function calculateGST(transactionValue, gstRate, isIntrastate) {
  const gstAmount = transactionValue * (gstRate / 100);
  let cgst = 0,
    sgst = 0,
    igst = 0;

  if (isIntrastate) {
    cgst = gstAmount / 2;
    sgst = gstAmount / 2;
  } else {
    igst = gstAmount;
  }

  return {
    GSTAmount: gstAmount,
    CGST: cgst,
    SGST: sgst,
    IGST: igst,
  };
}

module.exports = { calculateGST };
