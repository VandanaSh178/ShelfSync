export const calculateFine = (dueDate, returnDate) => {

  if (!dueDate || !returnDate) return 0;

  const finePerHour = 0.1; // ₹0.1 per hour

  // ⛔ No fine if returned before due date
  if (returnDate <= dueDate) return 0;

  const diffMs = returnDate - dueDate;

  const hoursOverdue = Math.ceil(diffMs / (1000 * 60 * 60));

  const fine = hoursOverdue * finePerHour;

  // ✅ Round to 2 decimal places
  return Number(fine.toFixed(2));
};