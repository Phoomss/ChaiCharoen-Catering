// Utility function to convert Decimal128 values to numbers for display
export const convertDecimalValue = (value) => {
  if (typeof value === 'object' && value !== null && value.$numberDecimal !== undefined) {
    return parseFloat(value.$numberDecimal);
  }
  return value;
};

// Utility function to format a price value for display
export const formatPrice = (value) => {
  const convertedValue = convertDecimalValue(value);
  return convertedValue.toLocaleString();
};

// Utility function to format a price value for display with currency
export const formatPriceWithCurrency = (value) => {
  const convertedValue = convertDecimalValue(value);
  return `฿${convertedValue.toLocaleString()}`;
};