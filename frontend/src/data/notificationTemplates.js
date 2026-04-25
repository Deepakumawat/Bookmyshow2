export const notificationTypes = {
  BOOKING_CONFIRMATION: 'booking_confirmation',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  BOOKING_REMINDER: 'booking_reminder',
  REFUND_INITIATED: 'refund_initiated',
  REFUND_COMPLETED: 'refund_completed',
  LOYALTY_POINTS_EARNED: 'loyalty_points_earned',
  TIER_UPGRADE: 'tier_upgrade',
  OFFER_AVAILABLE: 'offer_available',
  REVIEW_REMINDER: 'review_reminder',
  SPECIAL_OFFER: 'special_offer',
  CANCELLATION_CONFIRMATION: 'cancellation_confirmation',
};

export const notificationChannels = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  IN_APP: 'in_app',
};

export const notificationTemplates = {
  booking_confirmation: {
    type: 'booking_confirmation',
    title: 'Booking Confirmed! 🎬',
    icon: '✅',
    color: 'rgb(16, 185, 129)',
    emailSubject: 'Your Booking Confirmation - {eventTitle}',
    emailTemplate: `
      <h2>Booking Confirmed!</h2>
      <p>Dear {userName},</p>
      <p>Your booking for <strong>{eventTitle}</strong> has been confirmed.</p>
      <h3>Booking Details:</h3>
      <ul>
        <li><strong>Event:</strong> {eventTitle}</li>
        <li><strong>Date:</strong> {eventDate}</li>
        <li><strong>Theater:</strong> {theaterName}</li>
        <li><strong>Seats:</strong> {seats}</li>
        <li><strong>Amount:</strong> ₹{amount}</li>
        <li><strong>Booking ID:</strong> {bookingId}</li>
      </ul>
      <p><strong>Important:</strong> Please arrive 15 minutes before the show starts.</p>
      <p>Regards,<br/>BookMyShow Team</p>
    `,
    smsTemplate: 'Your booking for {eventTitle} on {eventDate} is confirmed. Booking ID: {bookingId}. Arrive 15 mins before showtime.',
    description: 'Confirmation of your booking',
    priority: 'high',
  },

  payment_success: {
    type: 'payment_success',
    title: 'Payment Successful! 💳',
    icon: '✓',
    color: 'rgb(16, 185, 129)',
    emailSubject: 'Payment Received - {eventTitle}',
    emailTemplate: `
      <h2>Payment Successful!</h2>
      <p>Dear {userName},</p>
      <p>Your payment of <strong>₹{amount}</strong> has been successfully processed.</p>
      <h3>Payment Details:</h3>
      <ul>
        <li><strong>Transaction ID:</strong> {transactionId}</li>
        <li><strong>Amount:</strong> ₹{amount}</li>
        <li><strong>Method:</strong> {paymentMethod}</li>
        <li><strong>Date:</strong> {date}</li>
      </ul>
      <p>Your booking is now confirmed. You will receive a separate email with your ticket details.</p>
      <p>Regards,<br/>BookMyShow Team</p>
    `,
    smsTemplate: 'Payment of ₹{amount} received for {eventTitle}. Transaction ID: {transactionId}',
    description: 'Confirmation of successful payment',
    priority: 'high',
  },

  payment_failed: {
    type: 'payment_failed',
    title: 'Payment Failed ❌',
    icon: '✕',
    color: '#FF4757',
    emailSubject: 'Payment Failed - {eventTitle}',
    emailTemplate: `
      <h2>Payment Failed</h2>
      <p>Dear {userName},</p>
      <p>Your payment attempt for <strong>₹{amount}</strong> could not be processed.</p>
      <h3>What Went Wrong:</h3>
      <p>{errorMessage}</p>
      <h3>Next Steps:</h3>
      <ol>
        <li>Check your payment method details</li>
        <li>Try again with a different payment method</li>
        <li>Contact your bank if issue persists</li>
      </ol>
      <p><strong>Note:</strong> Your seats are reserved for 10 minutes. Please complete payment soon.</p>
      <p>Regards,<br/>BookMyShow Team</p>
    `,
    smsTemplate: 'Payment failed for {eventTitle}. {errorMessage}. Please retry or contact support.',
    description: 'Notification of failed payment',
    priority: 'high',
  },

  booking_reminder: {
    type: 'booking_reminder',
    title: 'Show Reminder 🎫',
    icon: '⏰',
    color: '#F59E0B',
    emailSubject: 'Reminder: {eventTitle} starting soon',
    emailTemplate: `
      <h2>Your show is starting soon!</h2>
      <p>Dear {userName},</p>
      <p><strong>{eventTitle}</strong> starts in {hoursLeft} hours.</p>
      <h3>Quick Details:</h3>
      <ul>
        <li><strong>Event:</strong> {eventTitle}</li>
        <li><strong>Theater:</strong> {theaterName}</li>
        <li><strong>Show Time:</strong> {showTime}</li>
        <li><strong>Seats:</strong> {seats}</li>
      </ul>
      <p>Please arrive 15 minutes before the show. Have your booking ID ready!</p>
      <p>Regards,<br/>BookMyShow Team</p>
    `,
    smsTemplate: '{eventTitle} starts in {hoursLeft} hours at {theaterName}. Booking ID: {bookingId}',
    description: 'Reminder before your show',
    priority: 'medium',
  },

  loyalty_points_earned: {
    type: 'loyalty_points_earned',
    title: 'Points Earned! ⭐',
    icon: '⭐',
    color: '#FBBF24',
    emailSubject: 'You earned {points} loyalty points!',
    emailTemplate: `
      <h2>Loyalty Points Earned!</h2>
      <p>Dear {userName},</p>
      <p>Congratulations! You earned <strong>{points} loyalty points</strong> from your booking.</p>
      <h3>Points Summary:</h3>
      <ul>
        <li><strong>Points Earned:</strong> {points}</li>
        <li><strong>Total Points:</strong> {totalPoints}</li>
        <li><strong>Current Tier:</strong> {currentTier}</li>
        <li><strong>Points to Next Tier:</strong> {pointsToNextTier}</li>
      </ul>
      <p>Redeem your points for discounts on future bookings!</p>
      <p>Regards,<br/>BookMyShow Team</p>
    `,
    smsTemplate: 'You earned {points} loyalty points! Total: {totalPoints} points. Current tier: {currentTier}',
    description: 'Notification of earned loyalty points',
    priority: 'low',
  },

  tier_upgrade: {
    type: 'tier_upgrade',
    title: 'Tier Upgraded! 🎉',
    icon: '👑',
    color: '#34D399',
    emailSubject: 'Welcome to {newTier} tier!',
    emailTemplate: `
      <h2>You\'ve Been Upgraded!</h2>
      <p>Dear {userName},</p>
      <p>Congratulations! You\'ve reached <strong>{newTier}</strong> tier status.</p>
      <h3>Your New Benefits:</h3>
      <ul>
        {benefits}
      </ul>
      <p>Enjoy exclusive perks and higher discounts on future bookings!</p>
      <p>Regards,<br/>BookMyShow Team</p>
    `,
    smsTemplate: 'Congrats! You\'re now {newTier} tier with exclusive benefits. Redeem ₹{benefitValue} instantly!',
    description: 'Notification of loyalty tier upgrade',
    priority: 'medium',
  },

  offer_available: {
    type: 'offer_available',
    title: 'Special Offer for You! 🎁',
    icon: '🎁',
    color: '#EC4899',
    emailSubject: '{offerTitle} - Exclusive for you',
    emailTemplate: `
      <h2>Exclusive Offer!</h2>
      <p>Dear {userName},</p>
      <p>We have a special offer just for you: <strong>{offerTitle}</strong></p>
      <h3>Offer Details:</h3>
      <ul>
        <li><strong>Discount:</strong> {discount}</li>
        <li><strong>Minimum:</strong> ₹{minAmount}</li>
        <li><strong>Code:</strong> {offerCode}</li>
        <li><strong>Expires:</strong> {expiryDate}</li>
      </ul>
      <p>Use code <strong>{offerCode}</strong> at checkout to redeem this offer!</p>
      <p>Regards,<br/>BookMyShow Team</p>
    `,
    smsTemplate: 'Offer: {offerTitle}! Save {discount} with code {offerCode}. Valid till {expiryDate}',
    description: 'Notification of new offer',
    priority: 'medium',
  },

  review_reminder: {
    type: 'review_reminder',
    title: 'Share Your Experience! ⭐',
    icon: '✍️',
    color: '#60A5FA',
    emailSubject: 'How was your {eventTitle} experience?',
    emailTemplate: `
      <h2>Share Your Feedback!</h2>
      <p>Dear {userName},</p>
      <p>Your show <strong>{eventTitle}</strong> has ended. We'd love to hear about your experience!</p>
      <p>Your review helps other users make better choices and helps us improve our services.</p>
      <p><strong>Rate the theater and event</strong> on our app now!</p>
      <p>Regards,<br/>BookMyShow Team</p>
    `,
    smsTemplate: 'How was {eventTitle} at {theaterName}? Share your review and earn loyalty points!',
    description: 'Request for review/feedback',
    priority: 'low',
  },
};

export const getNotificationTemplate = (type) => {
  return notificationTemplates[type];
};

export const getNotificationsByChannel = (channel) => {
  return Object.values(notificationTemplates).filter(
    (template) => template.channels && template.channels.includes(channel)
  );
};
