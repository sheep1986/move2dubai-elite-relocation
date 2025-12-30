
import React, { useState, useEffect } from 'react';

interface TaxBracket {
  country: string;
  brackets: { min: number; max: number; rate: number }[];
  additionalTaxes?: { name: string; rate: number }[];
}

const TAX_DATA: Record<string, TaxBracket> = {
  'uk': {
    country: 'United Kingdom',
    brackets: [
      { min: 0, max: 12570, rate: 0 },
      { min: 12571, max: 50270, rate: 20 },
      { min: 50271, max: 125140, rate: 40 },
      { min: 125141, max: Infinity, rate: 45 },
    ],
    additionalTaxes: [
      { name: 'National Insurance', rate: 8 },
    ]
  },
  'us': {
    country: 'United States',
    brackets: [
      { min: 0, max: 11600, rate: 10 },
      { min: 11601, max: 47150, rate: 12 },
      { min: 47151, max: 100525, rate: 22 },
      { min: 100526, max: 191950, rate: 24 },
      { min: 191951, max: 243725, rate: 32 },
      { min: 243726, max: 609350, rate: 35 },
      { min: 609351, max: Infinity, rate: 37 },
    ],
    additionalTaxes: [
      { name: 'State Tax (avg)', rate: 5 },
      { name: 'Social Security', rate: 6.2 },
      { name: 'Medicare', rate: 1.45 },
    ]
  },
  'germany': {
    country: 'Germany',
    brackets: [
      { min: 0, max: 11604, rate: 0 },
      { min: 11605, max: 66760, rate: 14 },
      { min: 66761, max: 277825, rate: 42 },
      { min: 277826, max: Infinity, rate: 45 },
    ],
    additionalTaxes: [
      { name: 'Solidarity Surcharge', rate: 5.5 },
    ]
  },
  'france': {
    country: 'France',
    brackets: [
      { min: 0, max: 11294, rate: 0 },
      { min: 11295, max: 28797, rate: 11 },
      { min: 28798, max: 82341, rate: 30 },
      { min: 82342, max: 177106, rate: 41 },
      { min: 177107, max: Infinity, rate: 45 },
    ],
    additionalTaxes: [
      { name: 'Social Charges', rate: 9.7 },
    ]
  },
  'australia': {
    country: 'Australia',
    brackets: [
      { min: 0, max: 18200, rate: 0 },
      { min: 18201, max: 45000, rate: 19 },
      { min: 45001, max: 120000, rate: 32.5 },
      { min: 120001, max: 180000, rate: 37 },
      { min: 180001, max: Infinity, rate: 45 },
    ],
    additionalTaxes: [
      { name: 'Medicare Levy', rate: 2 },
    ]
  },
  'canada': {
    country: 'Canada',
    brackets: [
      { min: 0, max: 55867, rate: 15 },
      { min: 55868, max: 111733, rate: 20.5 },
      { min: 111734, max: 173205, rate: 26 },
      { min: 173206, max: 246752, rate: 29 },
      { min: 246753, max: Infinity, rate: 33 },
    ],
    additionalTaxes: [
      { name: 'Provincial Tax (avg)', rate: 12 },
      { name: 'CPP', rate: 5.95 },
    ]
  },
  'india': {
    country: 'India',
    brackets: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300001, max: 700000, rate: 5 },
      { min: 700001, max: 1000000, rate: 10 },
      { min: 1000001, max: 1200000, rate: 15 },
      { min: 1200001, max: 1500000, rate: 20 },
      { min: 1500001, max: Infinity, rate: 30 },
    ],
    additionalTaxes: [
      { name: 'Surcharge (high income)', rate: 10 },
    ]
  },
};

const CURRENCY_RATES: Record<string, number> = {
  'uk': 1.27, // GBP to USD
  'us': 1,
  'germany': 1.08, // EUR to USD
  'france': 1.08,
  'australia': 0.65, // AUD to USD
  'canada': 0.74, // CAD to USD
  'india': 0.012, // INR to USD
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  'uk': '£',
  'us': '$',
  'germany': '€',
  'france': '€',
  'australia': 'A$',
  'canada': 'C$',
  'india': '₹',
};

interface TaxCalculatorProps {
  onOpenConsultation: () => void;
}

export const TaxCalculator: React.FC<TaxCalculatorProps> = ({ onOpenConsultation }) => {
  const [country, setCountry] = useState('uk');
  const [income, setIncome] = useState<string>('250000');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const calculateTax = (countryCode: string, annualIncome: number): number => {
    const taxData = TAX_DATA[countryCode];
    if (!taxData) return 0;

    let tax = 0;
    let remainingIncome = annualIncome;

    for (const bracket of taxData.brackets) {
      if (remainingIncome <= 0) break;
      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min + 1);
      tax += taxableInBracket * (bracket.rate / 100);
      remainingIncome -= taxableInBracket;
    }

    // Add additional taxes
    if (taxData.additionalTaxes) {
      for (const addTax of taxData.additionalTaxes) {
        tax += annualIncome * (addTax.rate / 100);
      }
    }

    return tax;
  };

  const numericIncome = parseFloat(income.replace(/,/g, '')) || 0;
  const incomeInUSD = numericIncome * CURRENCY_RATES[country];
  const currentTax = calculateTax(country, numericIncome);
  const dubaiTax = 0; // 0% personal income tax
  const annualSavings = currentTax;
  const fiveYearSavings = annualSavings * 5;
  const tenYearSavings = annualSavings * 10;
  const effectiveTaxRate = numericIncome > 0 ? (currentTax / numericIncome) * 100 : 0;

  const formatCurrency = (amount: number, currencyCode: string = country) => {
    const symbol = CURRENCY_SYMBOLS[currencyCode] || '$';
    return `${symbol}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const formatUSD = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const handleCalculate = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowResults(true);
      setIsAnimating(false);
    }, 800);
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setIncome(value);
    setShowResults(false);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-navy p-8 md:p-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-white">Tax Savings Calculator</h2>
            <p className="text-white/60 text-sm">See how much you could save by relocating to Dubai</p>
          </div>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Current Country of Residence</label>
              <select
                value={country}
                onChange={(e) => { setCountry(e.target.value); setShowResults(false); }}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-gold focus:outline-none transition-colors text-navy bg-white appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
              >
                {Object.entries(TAX_DATA).map(([code, data]) => (
                  <option key={code} value={code}>{data.country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">Annual Income ({CURRENCY_SYMBOLS[country]})</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate text-lg">{CURRENCY_SYMBOLS[country]}</span>
                <input
                  type="text"
                  value={parseInt(income || '0').toLocaleString()}
                  onChange={handleIncomeChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:border-gold focus:outline-none transition-colors text-navy text-lg font-semibold"
                  placeholder="250,000"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium text-slate mb-2">Quick Select</label>
              <div className="flex flex-wrap gap-2">
                {[100000, 250000, 500000, 1000000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => { setIncome(preset.toString()); setShowResults(false); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      parseInt(income) === preset
                        ? 'bg-gold text-white'
                        : 'bg-slate/5 text-slate hover:bg-slate/10'
                    }`}
                  >
                    {formatCurrency(preset)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={isAnimating}
              className="w-full btn-primary py-4 rounded-xl text-sm uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
            >
              {isAnimating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Calculating...
                </>
              ) : (
                <>
                  Calculate My Savings
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className={`transition-all duration-500 ${showResults ? 'opacity-100 translate-y-0' : 'opacity-50'}`}>
            {/* Current Tax Burden */}
            <div className="bg-red-50 rounded-2xl p-6 mb-4 border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-600">Current Annual Tax</span>
                <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">{TAX_DATA[country].country}</span>
              </div>
              <div className="text-3xl font-display font-bold text-red-600">{formatCurrency(currentTax)}</div>
              <div className="text-sm text-red-500 mt-1">Effective rate: {effectiveTaxRate.toFixed(1)}%</div>
            </div>

            {/* Dubai Tax */}
            <div className="bg-emerald-50 rounded-2xl p-6 mb-4 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-600">Tax in Dubai</span>
                <span className="text-xs text-emerald-500 bg-emerald-100 px-2 py-1 rounded-full">UAE</span>
              </div>
              <div className="text-3xl font-display font-bold text-emerald-600">{formatCurrency(0)}</div>
              <div className="text-sm text-emerald-500 mt-1">0% personal income tax</div>
            </div>

            {/* Savings Breakdown */}
            <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-6 border border-gold/20">
              <div className="text-sm font-medium text-gold mb-4">Your Potential Savings</div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate">Annual Savings</span>
                  <span className="text-xl font-bold text-navy">{formatCurrency(annualSavings)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate">5-Year Savings</span>
                  <span className="text-xl font-bold text-navy">{formatCurrency(fiveYearSavings)}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gold/20">
                  <span className="text-navy font-medium">10-Year Savings</span>
                  <span className="text-2xl font-display font-bold text-gold">{formatCurrency(tenYearSavings)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {showResults && annualSavings > 0 && (
          <div className="mt-8 p-6 bg-navy rounded-2xl text-center">
            <p className="text-white/80 mb-4">
              You could save <span className="text-gold font-semibold">{formatCurrency(tenYearSavings)}</span> over 10 years by relocating to Dubai.
            </p>
            <button
              onClick={onOpenConsultation}
              className="btn-primary px-8 py-3 rounded-xl text-sm uppercase tracking-wider font-semibold inline-flex items-center gap-2"
            >
              Start Your Tax-Free Journey
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-slate text-center mt-6">
          *Calculations are estimates based on standard tax brackets and do not constitute financial advice.
          Actual savings may vary based on individual circumstances, deductions, and tax planning strategies.
        </p>
      </div>
    </div>
  );
};
