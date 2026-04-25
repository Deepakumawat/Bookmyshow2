import React, { createContext, useContext, useState, useEffect } from 'react';

export const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [lastPaymentResult, setLastPaymentResult] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('paymentMethods');
    if (saved) {
      try {
        setPaymentMethods(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load payment methods:', e);
      }
    }

    const savedHistory = localStorage.getItem('paymentHistory');
    if (savedHistory) {
      try {
        setPaymentHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load payment history:', e);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
  }, [paymentHistory]);

  const addPaymentMethod = (method) => {
    const newMethod = {
      id: `pm_${Date.now()}`,
      ...method,
      createdAt: new Date(),
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods((prev) => [...prev, newMethod]);
    return newMethod;
  };

  const removePaymentMethod = (methodId) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== methodId));
    if (selectedPaymentMethod?.id === methodId) {
      setSelectedPaymentMethod(null);
    }
  };

  const setDefaultPaymentMethod = (methodId) => {
    setPaymentMethods((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === methodId,
      }))
    );
    const method = paymentMethods.find((m) => m.id === methodId);
    if (method) {
      setSelectedPaymentMethod(method);
    }
  };

  const selectPaymentMethod = (methodId) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    if (method) {
      setSelectedPaymentMethod(method);
    }
  };

  const processPayment = async (amount, orderId, method) => {
    setProcessingPayment(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = {
        id: `txn_${Date.now()}`,
        orderId,
        amount,
        method: method.type,
        status: 'success',
        timestamp: new Date(),
        transactionId: `TXN${Date.now().toString().slice(-8)}`,
        message: 'Payment successful',
      };

      setLastPaymentResult(result);
      setPaymentHistory((prev) => [result, ...prev]);

      return result;
    } catch (error) {
      const result = {
        id: `txn_${Date.now()}`,
        orderId,
        amount,
        method: method.type,
        status: 'failed',
        timestamp: new Date(),
        error: error.message,
        message: 'Payment failed. Please try again.',
      };

      setLastPaymentResult(result);
      return result;
    } finally {
      setProcessingPayment(false);
    }
  };

  const getPaymentMethodDisplay = (method) => {
    if (method.type === 'card') {
      return `${method.cardType} •••• ${method.cardNumber.slice(-4)}`;
    } else if (method.type === 'upi') {
      return method.upiId;
    } else if (method.type === 'netbanking') {
      return method.bankName;
    } else if (method.type === 'wallet') {
      return `${method.walletProvider}`;
    }
    return 'Unknown';
  };

  const getDefaultPaymentMethod = () => {
    return paymentMethods.find((m) => m.isDefault) || paymentMethods[0];
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentMethods,
        selectedPaymentMethod,
        paymentHistory,
        processingPayment,
        lastPaymentResult,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        selectPaymentMethod,
        processPayment,
        getPaymentMethodDisplay,
        getDefaultPaymentMethod,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
}
