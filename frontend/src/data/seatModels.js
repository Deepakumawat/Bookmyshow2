export const seatTiers = {
  STANDARD: {
    id: 'standard',
    label: 'Standard',
    basePrice: 300,
    color: '#06b6d4',
    icon: '🔵',
  },
  PREMIUM: {
    id: 'premium',
    label: 'Premium',
    basePrice: 500,
    color: '#f59e0b',
    icon: '🟡',
  },
  VIP: {
    id: 'vip',
    label: 'VIP',
    basePrice: 800,
    color: '#8b5cf6',
    icon: '🟣',
  },
  EXECUTIVE: {
    id: 'executive',
    label: 'Executive Recliner',
    basePrice: 1200,
    color: '#ef4444',
    icon: '🔴',
  },
};

export const createTheaterLayout = (rows = 10, seatsPerRow = 15) => {
  const layout = [];
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let s = 1; s <= seatsPerRow; s++) {
      let tier = 'standard';

      // VIP: middle section, rows D-F
      if (r >= 3 && r <= 5 && s >= 6 && s <= 10) {
        tier = 'vip';
      }
      // Premium: middle rows, middle columns
      else if (r >= 2 && r <= 6 && s >= 5 && s <= 11) {
        tier = 'premium';
      }
      // Executive recliners: last 2 rows, middle section
      else if (r >= 8 && s >= 5 && s <= 11) {
        tier = 'executive';
      }

      const seat = {
        row: rowLabels[r],
        number: s,
        id: `${rowLabels[r]}${s}`,
        status: Math.random() > 0.7 ? 'booked' : 'available', // 30% booked
        tier,
        price: seatTiers[tier.toUpperCase()].basePrice,
      };

      row.push(seat);
    }
    layout.push(row);
  }

  return layout;
};

export const getSeatLegend = () => {
  return Object.values(seatTiers).map((tier) => ({
    tier: tier.id,
    label: tier.label,
    icon: tier.icon,
    color: tier.color,
    price: tier.basePrice,
  }));
};
