import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { emiOptions, calculateEMI, getEligibleEMIOptions } from '../../data/paymentMethods';

export function EMIOptions({ amount, onSelectEMI, onCancel }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedPlan, setSelectedPlan] = useState(null);

  const eligiblePlans = getEligibleEMIOptions(amount);

  if (eligiblePlans.length === 0) {
    return (
      <div
        style={{
          padding: 20,
          background: 'var(--bg-secondary)',
          borderRadius: 12,
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
          This booking amount is not eligible for EMI. Minimum ₹5,000 required.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700 }}>
        Available EMI Plans
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
        {eligiblePlans.map((plan) => {
          const monthlyAmount = calculateEMI(amount, plan.months, plan.interestRate);
          const totalInterest = monthlyAmount * plan.months - amount;
          const isSelected = selectedPlan?.months === plan.months;

          return (
            <div
              key={plan.months}
              onClick={() => setSelectedPlan(plan)}
              style={{
                padding: 20,
                background: isSelected ? 'var(--primary)' : 'var(--bg-secondary)',
                border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: 28,
                    fontWeight: 700,
                    color: isSelected ? 'white' : 'var(--primary)',
                  }}
                >
                  {plan.months}
                </p>
                <p
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: 12,
                    color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
                  }}
                >
                  months
                </p>

                <div
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.15)' : 'var(--bg-primary)',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: 12,
                      color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
                    }}
                  >
                    Monthly Payment
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 700,
                      color: isSelected ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    ₹{monthlyAmount.toLocaleString()}
                  </p>
                </div>

                <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                  <div style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)', marginBottom: 4 }}>
                    Interest Rate: {plan.interestRate}%
                  </div>
                  <div
                    style={{
                      color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
                      padding: '8px 0',
                      borderTop: `1px solid ${isSelected ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`,
                      marginTop: 8,
                    }}
                  >
                    Total Interest: ₹{totalInterest.toLocaleString()}
                  </div>
                </div>

                {plan.interestRate === 0 && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: '4px 8px',
                      background: 'rgb(16, 185, 129)',
                      color: 'white',
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    No Cost EMI
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {selectedPlan && (
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <h4 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700 }}>Plan Summary</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                Total Amount
              </p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>₹{amount.toFixed(2)}</p>
            </div>

            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                Monthly Payment
              </p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                ₹{calculateEMI(amount, selectedPlan.months, selectedPlan.interestRate).toLocaleString()}
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: 12, borderRadius: 8 }}>
            <p style={{ margin: '0 0 8px 0', fontSize: 12, color: 'var(--text-secondary)' }}>
              Breakdown
            </p>
            {Array.from({ length: selectedPlan.months }).map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>Month {i + 1}</span>
                <span>₹{calculateEMI(amount, selectedPlan.months, selectedPlan.interestRate).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => selectedPlan && onSelectEMI(selectedPlan, calculateEMI(amount, selectedPlan.months, selectedPlan.interestRate))}
          disabled={!selectedPlan}
          style={{
            flex: 1,
            padding: '14px 20px',
            background: selectedPlan ? 'var(--primary)' : 'var(--text-secondary)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 700,
            cursor: selectedPlan ? 'pointer' : 'not-allowed',
            opacity: selectedPlan ? 1 : 0.5,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (selectedPlan) {
              e.target.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          Select Plan
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '14px 20px',
            background: 'transparent',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--primary)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--primary)';
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
