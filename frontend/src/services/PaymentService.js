// Payment processing service
// This is a mock service for demonstration purposes
// In production, this would integrate with actual payment gateways (Stripe, Razorpay, etc.)

export class PaymentService {
  static async validatePaymentMethod(method) {
    // Validate payment method based on type
    if (method.type === 'card') {
      return this.validateCard(method);
    } else if (method.type === 'upi') {
      return this.validateUPI(method);
    } else if (method.type === 'netbanking') {
      return this.validateNetBanking(method);
    } else if (method.type === 'wallet') {
      return this.validateWallet(method);
    }
    return { valid: false, message: 'Invalid payment method type' };
  }

  static validateCard(card) {
    if (!card.cardNumber || card.cardNumber.replace(/\s/g, '').length !== 16) {
      return { valid: false, message: 'Invalid card number' };
    }
    if (!card.cardholderName) {
      return { valid: false, message: 'Cardholder name required' };
    }
    if (!card.expiryDate || !/^\d{2}\/\d{2}$/.test(card.expiryDate)) {
      return { valid: false, message: 'Invalid expiry date' };
    }
    if (!card.cvv || card.cvv.length < 3) {
      return { valid: false, message: 'Invalid CVV' };
    }

    // Check card expiry
    const [month, year] = card.expiryDate.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return { valid: false, message: 'Card has expired' };
    }

    return { valid: true };
  }

  static validateUPI(upi) {
    if (!upi.upiId || !/^[\w\.\-]+@[\w]+$/.test(upi.upiId)) {
      return { valid: false, message: 'Invalid UPI ID format' };
    }
    return { valid: true };
  }

  static validateNetBanking(banking) {
    if (!banking.bankName) {
      return { valid: false, message: 'Bank name required' };
    }
    return { valid: true };
  }

  static validateWallet(wallet) {
    if (!wallet.walletProvider) {
      return { valid: false, message: 'Wallet provider required' };
    }
    if (!wallet.walletId) {
      return { valid: false, message: 'Wallet ID required' };
    }
    if (!wallet.walletBalance || wallet.walletBalance <= 0) {
      return { valid: false, message: 'Insufficient wallet balance' };
    }
    return { valid: true };
  }

  static async processPayment(amount, paymentMethod, orderId) {
    // Validate method
    const validation = this.validatePaymentMethod(paymentMethod);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message,
        orderId,
      };
    }

    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        const isSuccess = Math.random() > 0.05;

        if (isSuccess) {
          resolve({
            success: true,
            message: 'Payment processed successfully',
            transactionId: `TXN${Date.now().toString().slice(-8)}`,
            amount,
            orderId,
            method: paymentMethod.type,
            timestamp: new Date(),
          });
        } else {
          resolve({
            success: false,
            message: 'Payment failed. Please try again.',
            orderId,
            error: 'PAYMENT_DECLINED',
          });
        }
      }, 2000);
    });
  }

  static async refundPayment(transactionId, amount) {
    // Mock refund processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Refund initiated successfully',
          refundId: `REF${Date.now().toString().slice(-8)}`,
          amount,
          originalTransaction: transactionId,
          estimatedRefundDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        });
      }, 1500);
    });
  }

  static async getPaymentStatus(transactionId) {
    // Mock status check
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactionId,
          status: 'success',
          amount: 0,
          timestamp: new Date(),
        });
      }, 500);
    });
  }

  static calculateTaxes(amount, taxRate = 0.18) {
    return {
      subtotal: amount / (1 + taxRate),
      tax: amount - amount / (1 + taxRate),
      total: amount,
    };
  }

  static generateReceipt(bookingData, paymentData) {
    return {
      receiptId: `RCP${Date.now().toString().slice(-8)}`,
      bookingId: bookingData.bookingId,
      eventTitle: bookingData.eventTitle,
      eventDate: bookingData.eventDate,
      theater: bookingData.theaterName,
      seats: bookingData.selectedSeats,
      amount: paymentData.amount,
      paymentMethod: paymentData.method,
      transactionId: paymentData.transactionId,
      issuedAt: new Date(),
      expiresAt: new Date(bookingData.eventDate),
    };
  }
}
