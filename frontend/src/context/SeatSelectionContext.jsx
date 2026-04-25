import React, { createContext, useContext, useState } from 'react';

export const SeatSelectionContext = createContext();

export function SeatSelectionProvider({ children }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [theaterLayout, setTheaterLayout] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const selectSeat = (seat) => {
    const isSelected = selectedSeats.find((s) => s.id === seat.id);
    if (isSelected) {
      deselectSeat(seat.id);
    } else {
      if (seat.status === 'booked') return false;
      const newSeats = [...selectedSeats, seat];
      setSelectedSeats(newSeats);
      calculateTotal(newSeats);
      return true;
    }
  };

  const deselectSeat = (seatId) => {
    const newSeats = selectedSeats.filter((s) => s.id !== seatId);
    setSelectedSeats(newSeats);
    calculateTotal(newSeats);
  };

  const calculateTotal = (seats) => {
    const total = seats.reduce((sum, seat) => sum + seat.price, 0);
    setTotalPrice(total);
  };

  const isSeatSelected = (seatId) => {
    return selectedSeats.some((s) => s.id === seatId);
  };

  const clearSelection = () => {
    setSelectedSeats([]);
    setTotalPrice(0);
  };

  const getSelectedSeatsList = () => {
    return selectedSeats.map((s) => `${s.row}${s.number}`).sort();
  };

  return (
    <SeatSelectionContext.Provider
      value={{
        selectedSeats,
        hoveredSeat,
        setHoveredSeat,
        selectSeat,
        deselectSeat,
        isSeatSelected,
        clearSelection,
        totalPrice,
        theaterLayout,
        setTheaterLayout,
        getSelectedSeatsList,
      }}
    >
      {children}
    </SeatSelectionContext.Provider>
  );
}

export function useSeatSelection() {
  const context = useContext(SeatSelectionContext);
  if (!context) {
    throw new Error('useSeatSelection must be used within SeatSelectionProvider');
  }
  return context;
}
