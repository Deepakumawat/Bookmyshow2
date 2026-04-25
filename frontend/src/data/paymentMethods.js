export const PAYMENT_METHOD_TYPES = {
  CARD: 'card',
  UPI: 'upi',
  NETBANKING: 'netbanking',
  WALLET: 'wallet',
};

export const paymentMethodTemplates = {
  card: {
    type: 'card',
    icon: '💳',
    label: 'Credit/Debit Card',
    fields: ['cardNumber', 'cardholderName', 'expiryDate', 'cvv'],
    displayFormat: (method) => `${method.cardType} •••• ${method.cardNumber.slice(-4)}`,
    color: '#3B82F6',
  },
  upi: {
    type: 'upi',
    icon: '📱',
    label: 'UPI',
    fields: ['upiId'],
    displayFormat: (method) => method.upiId,
    color: '#8B5CF6',
  },
  netbanking: {
    type: 'netbanking',
    icon: '🏦',
    label: 'Net Banking',
    fields: ['bankName'],
    displayFormat: (method) => method.bankName,
    color: '#10B981',
  },
  wallet: {
    type: 'wallet',
    icon: '👛',
    label: 'Digital Wallet',
    fields: ['walletProvider', 'walletId'],
    displayFormat: (method) => `${method.walletProvider} (₹${method.walletBalance})`,
    color: '#F59E0B',
  },
};

export const cardTypes = ['Visa', 'Mastercard', 'American Express', 'RuPay'];

export const banks = [
  'HDFC Bank',
  'ICICI Bank',
  'SBI',
  'Axis Bank',
  'Kotak Mahindra',
  'Yes Bank',
  'IndusInd Bank',
  'Canara Bank',
];

export const walletProviders = [
  'Google Pay',
  'PhonePe',
  'Paytm',
  'Amazon Pay',
  'WhatsApp Pay',
];

export const emiOptions = [
  {
    months: 3,
    interestRate: 0,
    minAmount: 5000,
    label: '3 Months No Cost EMI',
  },
  {
    months: 6,
    interestRate: 1.5,
    minAmount: 10000,
    label: '6 Months (1.5% Interest)',
  },
  {
    months: 9,
    interestRate: 2.0,
    minAmount: 15000,
    label: '9 Months (2% Interest)',
  },
  {
    months: 12,
    interestRate: 2.5,
    minAmount: 20000,
    label: '12 Months (2.5% Interest)',
  },
];

export const calculateEMI = (amount, months, interestRate) => {
  const monthlyRate = interestRate / 100 / 12;
  const emiAmount = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emiAmount);
};

export const getEligibleEMIOptions = (amount) => {
  return emiOptions.filter((option) => amount >= option.minAmount);
};
