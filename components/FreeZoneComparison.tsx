
import React, { useState, useMemo } from 'react';

interface FreeZone {
  id: string;
  name: string;
  shortName: string;
  location: string;
  established: number;
  description: string;
  industries: string[];
  highlights: string[];
  costs: {
    licenseFrom: number;
    visaFrom: number;
    officeFrom: number;
    packageFrom: number;
  };
  visaAllocation: string;
  ownership: string;
  officeOptions: string[];
  processingTime: string;
  rating: number;
  popular: boolean;
}

const FREE_ZONES: FreeZone[] = [
  {
    id: 'dmcc',
    name: 'Dubai Multi Commodities Centre',
    shortName: 'DMCC',
    location: 'JLT, Dubai',
    established: 2002,
    description: 'World\'s leading free zone for commodities trade, awarded "Global Free Zone of the Year" multiple times.',
    industries: ['Trading', 'Commodities', 'Consulting', 'Tech', 'Finance'],
    highlights: ['#1 Global Free Zone', 'Premium JLT Address', 'Strong Business Network'],
    costs: {
      licenseFrom: 15000,
      visaFrom: 3500,
      officeFrom: 12000,
      packageFrom: 22000,
    },
    visaAllocation: '3-6 visas',
    ownership: '100% Foreign',
    officeOptions: ['Flexi-desk', 'Hot Desk', 'Dedicated Desk', 'Private Office', 'Warehouse'],
    processingTime: '3-5 days',
    rating: 4.8,
    popular: true,
  },
  {
    id: 'difc',
    name: 'Dubai International Financial Centre',
    shortName: 'DIFC',
    location: 'DIFC, Dubai',
    established: 2004,
    description: 'Premier financial hub with independent legal framework based on English Common Law.',
    industries: ['Finance', 'Banking', 'Insurance', 'Asset Management', 'Legal', 'Fintech'],
    highlights: ['Common Law Jurisdiction', 'DIFC Courts', 'Top Financial Hub'],
    costs: {
      licenseFrom: 20000,
      visaFrom: 4000,
      officeFrom: 25000,
      packageFrom: 45000,
    },
    visaAllocation: '2-6 visas',
    ownership: '100% Foreign',
    officeOptions: ['Flexi-desk', 'Private Office', 'Co-working'],
    processingTime: '5-7 days',
    rating: 4.9,
    popular: true,
  },
  {
    id: 'dafza',
    name: 'Dubai Airport Free Zone',
    shortName: 'DAFZA',
    location: 'Near DXB Airport',
    established: 1996,
    description: 'Strategic location adjacent to Dubai International Airport, ideal for logistics and trade.',
    industries: ['Logistics', 'Aviation', 'Trading', 'Pharma', 'Electronics'],
    highlights: ['Airport Adjacent', 'Excellent Logistics', 'Tax Exemptions'],
    costs: {
      licenseFrom: 12000,
      visaFrom: 3000,
      officeFrom: 15000,
      packageFrom: 20000,
    },
    visaAllocation: '3-6 visas',
    ownership: '100% Foreign',
    officeOptions: ['Flexi-desk', 'Office', 'Warehouse', 'Land'],
    processingTime: '3-5 days',
    rating: 4.6,
    popular: true,
  },
  {
    id: 'jafza',
    name: 'Jebel Ali Free Zone',
    shortName: 'JAFZA',
    location: 'Jebel Ali, Dubai',
    established: 1985,
    description: 'Largest and oldest free zone in the Middle East, connected to Jebel Ali Port.',
    industries: ['Manufacturing', 'Logistics', 'Trading', 'Heavy Industry', 'Automotive'],
    highlights: ['Largest Free Zone', 'Port Access', 'Manufacturing Hub'],
    costs: {
      licenseFrom: 15000,
      visaFrom: 3500,
      officeFrom: 18000,
      packageFrom: 25000,
    },
    visaAllocation: '3-unlimited',
    ownership: '100% Foreign',
    officeOptions: ['Office', 'Warehouse', 'Land', 'Factory'],
    processingTime: '3-7 days',
    rating: 4.7,
    popular: true,
  },
  {
    id: 'ifza',
    name: 'International Free Zone Authority',
    shortName: 'IFZA',
    location: 'Dubai Silicon Oasis',
    established: 2017,
    description: 'Cost-effective free zone with streamlined processes, popular among startups and SMEs.',
    industries: ['Consulting', 'E-commerce', 'IT', 'Trading', 'Services'],
    highlights: ['Budget Friendly', 'Fast Setup', 'Flexible Packages'],
    costs: {
      licenseFrom: 5750,
      visaFrom: 3000,
      officeFrom: 0,
      packageFrom: 11500,
    },
    visaAllocation: '2-6 visas',
    ownership: '100% Foreign',
    officeOptions: ['Virtual Office', 'Flexi-desk', 'Private Office'],
    processingTime: '2-3 days',
    rating: 4.4,
    popular: true,
  },
  {
    id: 'rakez',
    name: 'Ras Al Khaimah Economic Zone',
    shortName: 'RAKEZ',
    location: 'RAK, UAE',
    established: 2017,
    description: 'Affordable alternative outside Dubai with excellent value and flexible regulations.',
    industries: ['Trading', 'Consulting', 'E-commerce', 'Manufacturing', 'Services'],
    highlights: ['Most Affordable', 'No Office Required', 'RAK Location'],
    costs: {
      licenseFrom: 5500,
      visaFrom: 2500,
      officeFrom: 0,
      packageFrom: 9500,
    },
    visaAllocation: '2-3 visas',
    ownership: '100% Foreign',
    officeOptions: ['Virtual Office', 'Flexi-desk', 'Warehouse'],
    processingTime: '2-4 days',
    rating: 4.3,
    popular: false,
  },
  {
    id: 'dso',
    name: 'Dubai Silicon Oasis',
    shortName: 'DSO',
    location: 'Silicon Oasis, Dubai',
    established: 2004,
    description: 'Technology-focused free zone with integrated tech park and residential community.',
    industries: ['Tech', 'Software', 'Electronics', 'R&D', 'Smart Tech'],
    highlights: ['Tech Focused', 'Innovation Hub', 'Integrated Community'],
    costs: {
      licenseFrom: 10000,
      visaFrom: 3500,
      officeFrom: 12000,
      packageFrom: 18000,
    },
    visaAllocation: '2-6 visas',
    ownership: '100% Foreign',
    officeOptions: ['Flexi-desk', 'Office', 'Tech Lab'],
    processingTime: '3-5 days',
    rating: 4.5,
    popular: false,
  },
  {
    id: 'tecom',
    name: 'Dubai Internet City / Media City',
    shortName: 'TECOM',
    location: 'Media City, Dubai',
    established: 1999,
    description: 'Premier hub for technology, media, and creative industries in the heart of Dubai.',
    industries: ['Tech', 'Media', 'Marketing', 'Advertising', 'Digital'],
    highlights: ['Media & Tech Hub', 'Premium Location', 'Industry Network'],
    costs: {
      licenseFrom: 15000,
      visaFrom: 3500,
      officeFrom: 20000,
      packageFrom: 30000,
    },
    visaAllocation: '3-6 visas',
    ownership: '100% Foreign',
    officeOptions: ['Flexi-desk', 'Office', 'Studio'],
    processingTime: '3-5 days',
    rating: 4.6,
    popular: false,
  },
  {
    id: 'adgm',
    name: 'Abu Dhabi Global Market',
    shortName: 'ADGM',
    location: 'Al Maryah Island, Abu Dhabi',
    established: 2013,
    description: 'International financial centre with Common Law jurisdiction, rivaling DIFC.',
    industries: ['Finance', 'Asset Management', 'Fintech', 'Wealth Management'],
    highlights: ['Common Law', 'Financial Hub', 'Abu Dhabi Location'],
    costs: {
      licenseFrom: 15000,
      visaFrom: 4000,
      officeFrom: 20000,
      packageFrom: 35000,
    },
    visaAllocation: '2-6 visas',
    ownership: '100% Foreign',
    officeOptions: ['Flexi-desk', 'Private Office'],
    processingTime: '5-10 days',
    rating: 4.7,
    popular: false,
  },
  {
    id: 'shams',
    name: 'Sharjah Media City',
    shortName: 'SHAMS',
    location: 'Sharjah, UAE',
    established: 2017,
    description: 'Budget-friendly free zone in Sharjah, popular for freelancers and small businesses.',
    industries: ['Media', 'E-commerce', 'Consulting', 'Trading', 'Services'],
    highlights: ['Very Affordable', 'Freelancer Friendly', 'Quick Setup'],
    costs: {
      licenseFrom: 5750,
      visaFrom: 2800,
      officeFrom: 0,
      packageFrom: 9500,
    },
    visaAllocation: '1-3 visas',
    ownership: '100% Foreign',
    officeOptions: ['Virtual Office', 'Flexi-desk'],
    processingTime: '1-3 days',
    rating: 4.2,
    popular: false,
  },
];

const INDUSTRY_FILTERS = [
  'All Industries',
  'Trading',
  'Tech',
  'Finance',
  'Consulting',
  'Media',
  'Logistics',
  'E-commerce',
  'Manufacturing',
];

interface FreeZoneComparisonProps {
  onOpenConsultation: () => void;
}

export const FreeZoneComparison: React.FC<FreeZoneComparisonProps> = ({ onOpenConsultation }) => {
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [budgetRange, setBudgetRange] = useState<'all' | 'budget' | 'mid' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price' | 'rating'>('popular');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const filteredZones = useMemo(() => {
    let zones = [...FREE_ZONES];

    // Filter by industry
    if (selectedIndustry !== 'All Industries') {
      zones = zones.filter(z => z.industries.includes(selectedIndustry));
    }

    // Filter by budget
    if (budgetRange === 'budget') {
      zones = zones.filter(z => z.costs.packageFrom < 15000);
    } else if (budgetRange === 'mid') {
      zones = zones.filter(z => z.costs.packageFrom >= 15000 && z.costs.packageFrom < 30000);
    } else if (budgetRange === 'premium') {
      zones = zones.filter(z => z.costs.packageFrom >= 30000);
    }

    // Sort
    if (sortBy === 'price') {
      zones.sort((a, b) => a.costs.packageFrom - b.costs.packageFrom);
    } else if (sortBy === 'rating') {
      zones.sort((a, b) => b.rating - a.rating);
    } else {
      zones.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return zones;
  }, [selectedIndustry, budgetRange, sortBy]);

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(z => z !== id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, id]);
    }
  };

  const compareZones = FREE_ZONES.filter(z => compareList.includes(z.id));

  const formatPrice = (price: number) => `AED ${price.toLocaleString()}`;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-navy p-8 md:p-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-white">Free Zone Comparison</h2>
            <p className="text-white/60 text-sm">Compare 40+ UAE free zones to find your perfect match</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div>
            <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">Industry</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
            >
              {INDUSTRY_FILTERS.map(industry => (
                <option key={industry} value={industry} className="text-navy">{industry}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">Budget</label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
            >
              <option value="all" className="text-navy">All Budgets</option>
              <option value="budget" className="text-navy">Budget (Under AED 15K)</option>
              <option value="mid" className="text-navy">Mid-Range (AED 15-30K)</option>
              <option value="premium" className="text-navy">Premium (AED 30K+)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
            >
              <option value="popular" className="text-navy">Most Popular</option>
              <option value="price" className="text-navy">Lowest Price</option>
              <option value="rating" className="text-navy">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <div className="mt-6 p-4 bg-gold/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gold font-medium">{compareList.length} selected</span>
              <span className="text-white/60">for comparison</span>
            </div>
            <button
              onClick={() => setShowCompare(true)}
              className="px-6 py-2 bg-gold text-white rounded-lg font-medium hover:bg-gold/90 transition-colors"
            >
              Compare Now
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-8 md:p-12">
        {/* Comparison Modal */}
        {showCompare && compareList.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/95">
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="text-xl font-semibold text-navy">Side-by-Side Comparison</h3>
                <button
                  onClick={() => setShowCompare(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="text-left p-3 text-slate text-sm font-medium">Feature</th>
                      {compareZones.map(z => (
                        <th key={z.id} className="text-left p-3">
                          <div className="font-semibold text-navy">{z.shortName}</div>
                          <div className="text-xs text-slate">{z.location}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-100">
                      <td className="p-3 text-slate text-sm">Package From</td>
                      {compareZones.map(z => (
                        <td key={z.id} className="p-3 font-semibold text-gold">{formatPrice(z.costs.packageFrom)}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-100 bg-slate-50">
                      <td className="p-3 text-slate text-sm">License Cost</td>
                      {compareZones.map(z => (
                        <td key={z.id} className="p-3 text-navy">{formatPrice(z.costs.licenseFrom)}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="p-3 text-slate text-sm">Visa Cost</td>
                      {compareZones.map(z => (
                        <td key={z.id} className="p-3 text-navy">{formatPrice(z.costs.visaFrom)}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-100 bg-slate-50">
                      <td className="p-3 text-slate text-sm">Visa Allocation</td>
                      {compareZones.map(z => (
                        <td key={z.id} className="p-3 text-navy">{z.visaAllocation}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="p-3 text-slate text-sm">Processing Time</td>
                      {compareZones.map(z => (
                        <td key={z.id} className="p-3 text-navy">{z.processingTime}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-100 bg-slate-50">
                      <td className="p-3 text-slate text-sm">Ownership</td>
                      {compareZones.map(z => (
                        <td key={z.id} className="p-3 text-emerald-600 font-medium">{z.ownership}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="p-3 text-slate text-sm">Industries</td>
                      {compareZones.map(z => (
                        <td key={z.id} className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {z.industries.slice(0, 3).map(ind => (
                              <span key={ind} className="text-xs bg-slate-100 text-slate px-2 py-0.5 rounded">{ind}</span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-100 bg-slate-50">
                      <td className="p-3 text-slate text-sm">Rating</td>
                      {compareZones.map(z => (
                        <td key={z.id} className="p-3">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-medium text-navy">{z.rating}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => { setShowCompare(false); onOpenConsultation(); }}
                  className="w-full btn-primary py-4 rounded-xl text-sm uppercase tracking-wider font-semibold"
                >
                  Get Expert Advice on These Options
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate">{filteredZones.length} free zones found</p>
          <p className="text-xs text-slate">Select up to 3 to compare</p>
        </div>

        {/* Free Zone Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              className={`rounded-2xl border-2 p-6 transition-all ${
                compareList.includes(zone.id)
                  ? 'border-gold bg-gold/5'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-navy">{zone.shortName}</h3>
                    {zone.popular && (
                      <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full font-medium">Popular</span>
                    )}
                  </div>
                  <p className="text-sm text-slate">{zone.location}</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                  <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium text-navy">{zone.rating}</span>
                </div>
              </div>

              <p className="text-sm text-slate mb-4 line-clamp-2">{zone.description}</p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2 mb-4">
                {zone.highlights.map((h, i) => (
                  <span key={i} className="text-xs bg-navy/5 text-navy px-2 py-1 rounded">{h}</span>
                ))}
              </div>

              {/* Costs */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="text-xs text-slate mb-1">Package From</div>
                  <div className="text-lg font-semibold text-gold">{formatPrice(zone.costs.packageFrom)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate mb-1">Processing</div>
                  <div className="text-lg font-semibold text-navy">{zone.processingTime}</div>
                </div>
              </div>

              {/* Industries */}
              <div className="flex flex-wrap gap-1 mb-4">
                {zone.industries.slice(0, 4).map((ind) => (
                  <span key={ind} className="text-xs text-slate bg-slate-100 px-2 py-0.5 rounded">{ind}</span>
                ))}
                {zone.industries.length > 4 && (
                  <span className="text-xs text-slate">+{zone.industries.length - 4} more</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => toggleCompare(zone.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    compareList.includes(zone.id)
                      ? 'bg-gold text-white'
                      : 'bg-slate-100 text-slate hover:bg-slate-200'
                  }`}
                >
                  {compareList.includes(zone.id) ? 'Selected' : 'Compare'}
                </button>
                <button
                  onClick={onOpenConsultation}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-navy text-white hover:bg-navy/90 transition-colors"
                >
                  Get Quote
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-navy rounded-2xl text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Not Sure Which Free Zone is Right for You?</h3>
          <p className="text-white/60 mb-6">Our experts will analyze your business needs and recommend the perfect match.</p>
          <button
            onClick={onOpenConsultation}
            className="btn-primary px-8 py-3 rounded-xl text-sm uppercase tracking-wider font-semibold"
          >
            Get Free Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
