
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { useNavigation } from '../App';

interface LeadFormProps {
  onClose?: () => void;
  isModal?: boolean;
}

type RelocationProfile = 'Family' | 'Business' | 'Investor' | 'Executive';
type Jurisdiction = 'United Kingdom' | 'Europe' | 'North America' | 'Asia Pacific' | 'Other';
type ServiceType = 'Residency' | 'Property' | 'Banking' | 'Education' | 'Tax Strategy' | 'Corporate';

export const LeadForm: React.FC<LeadFormProps> = ({ onClose, isModal }) => {
  const [step, setStep] = useState(1);
  const { navigate } = useNavigation();
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);

  const [formData, setFormData] = useState({
    profile: '' as RelocationProfile | '',
    jurisdiction: '' as Jurisdiction | '',
    timeline: 'Immediate',
    investmentBracket: '£2M+',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const selectProfile = (p: RelocationProfile) => {
    setFormData({ ...formData, profile: p });
    setTimeout(nextStep, 300);
  };

  const toggleService = (s: ServiceType) => {
    setSelectedServices(prev =>
      prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('thank-you/consultation');
  };

  const inputClass = "w-full bg-transparent border-b-2 border-slate-200 px-0 py-4 text-lg focus:outline-none focus:border-gold transition-colors text-navy placeholder:text-slate-400 font-medium";

  return (
    <div className={`${isModal ? 'bg-white rounded-2xl p-8 md:p-12 max-w-3xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh]' : 'bg-white rounded-2xl p-12 shadow-elegant-lg'}`}>
      {isModal && onClose && (
        <button onClick={onClose} className="absolute top-6 right-6 text-navy hover:text-gold transition-colors z-50 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-gold' : 'bg-slate-100'}`}></div>
          ))}
        </div>
        <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-slate-400">
          <span className={step >= 1 ? 'text-gold' : ''}>Profile</span>
          <span className={step >= 2 ? 'text-gold' : ''}>Services</span>
          <span className={step >= 3 ? 'text-gold' : ''}>Scale</span>
          <span className={step >= 4 ? 'text-gold' : ''}>Location</span>
          <span className={step >= 5 ? 'text-gold' : ''}>Contact</span>
        </div>
      </div>

      <div className="min-h-[400px]">
        {/* STEP 1: PROFILE */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-display font-semibold text-navy mb-4">Define Your Profile</h3>
            <p className="text-slate mb-10">Select the option that best describes your primary relocation objective.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'Family', label: 'Family Relocation', icon: <ICONS.Home />, desc: 'Education, healthcare, and lifestyle for your family.' },
                { id: 'Business', label: 'Business Owner', icon: <ICONS.Briefcase />, desc: 'Relocate your business operations to the UAE.' },
                { id: 'Investor', label: 'Investor', icon: <ICONS.ChartBar />, desc: 'Real estate and investment-based residency.' },
                { id: 'Executive', label: 'Executive', icon: <ICONS.User />, desc: 'Personal relocation for senior professionals.' }
              ].map((card) => (
                <button
                  key={card.id}
                  onClick={() => selectProfile(card.id as RelocationProfile)}
                  className={`group relative p-6 text-left rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${formData.profile === card.id ? 'border-gold bg-gold/5 shadow-gold' : 'border-slate-100 hover:border-gold/30'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg transition-colors ${formData.profile === card.id ? 'bg-gold text-white' : 'bg-slate-50 text-gold'}`}>
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-navy mb-1 group-hover:text-gold transition-colors">{card.label}</h4>
                      <p className="text-sm text-slate">{card.desc}</p>
                    </div>
                    {formData.profile === card.id && (
                      <div className="text-gold"><ICONS.CheckCircle /></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SERVICES */}
        {step === 2 && (
          <div className="animate-fade-in">
            <button onClick={prevStep} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-gold mb-6 transition-colors">
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Back
            </button>
            <h3 className="text-3xl md:text-4xl font-display font-semibold text-navy mb-4">Select Services</h3>
            <p className="text-slate mb-10">Choose all the services you require. Select one or more.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: 'Residency', label: 'Visa & Residency', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                )},
                { id: 'Property', label: 'Property', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                )},
                { id: 'Banking', label: 'Private Banking', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                )},
                { id: 'Education', label: 'Education', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147L12 15l7.74-4.853a.75.75 0 000-1.294L12 4l-7.74 4.853a.75.75 0 000 1.294z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.31 12.347l-1.908 1.119a.75.75 0 000 1.294L12 19.5l7.598-4.74a.75.75 0 000-1.294l-1.908-1.119L12 15.875l-5.69-3.528z" />
                  </svg>
                )},
                { id: 'Tax Strategy', label: 'Tax Strategy', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                  </svg>
                )},
                { id: 'Corporate', label: 'Corporate Setup', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H6.25a2.25 2.25 0 00-2.25 2.25m16.5 0v-1.5c0-.621-.504-1.125-1.125-1.125H4.875c-.621 0-1.125.504-1.125 1.125v1.5m16.5 0h-16.5m8.25-11.25h4.5M12 6.375v4.5" />
                  </svg>
                )}
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleService(s.id as ServiceType)}
                  className={`p-6 text-center rounded-xl border-2 transition-all duration-300 ${selectedServices.includes(s.id as ServiceType) ? 'border-gold bg-gold/5' : 'border-slate-100 hover:border-gold/30'}`}
                >
                  <div className={`mx-auto mb-3 w-8 h-8 flex items-center justify-center transition-colors ${selectedServices.includes(s.id as ServiceType) ? 'text-gold' : 'text-navy/40'}`}>
                    {s.icon}
                  </div>
                  <span className={`text-sm font-medium ${selectedServices.includes(s.id as ServiceType) ? 'text-navy' : 'text-navy/70'}`}>{s.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={selectedServices.length === 0}
              className={`mt-10 w-full py-4 rounded-lg font-semibold uppercase tracking-wider text-sm transition-all ${selectedServices.length > 0 ? 'btn-primary' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 3: SCALE */}
        {step === 3 && (
          <div className="animate-fade-in">
            <button onClick={prevStep} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-gold mb-6 transition-colors">
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Back
            </button>
            <h3 className="text-3xl md:text-4xl font-display font-semibold text-navy mb-4">Investment Scale</h3>
            <p className="text-slate mb-10">Help us understand the scope of your relocation.</p>

            <div className="space-y-10">
              <div>
                <label className="text-sm font-medium text-gold uppercase tracking-wider block mb-4">Anticipated Investment</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['< £500k', '£500k - £2M', '£2M - £10M', '£10M+'].map(bracket => (
                    <button
                      key={bracket}
                      onClick={() => setFormData({...formData, investmentBracket: bracket})}
                      className={`py-4 px-4 text-sm font-medium rounded-lg border-2 transition-all ${formData.investmentBracket === bracket ? 'bg-navy text-white border-navy' : 'border-slate-100 text-slate hover:border-gold/30'}`}
                    >
                      {bracket}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gold uppercase tracking-wider block mb-4">Timeline</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Immediate', '3 Months', '6 Months', 'Planning'].map(time => (
                    <button
                      key={time}
                      onClick={() => setFormData({...formData, timeline: time})}
                      className={`py-4 px-4 text-sm font-medium rounded-lg border-2 transition-all ${formData.timeline === time ? 'bg-navy text-white border-navy' : 'border-slate-100 text-slate hover:border-gold/30'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={nextStep} className="mt-10 w-full btn-primary py-4 rounded-lg font-semibold uppercase tracking-wider text-sm">
              Continue
            </button>
          </div>
        )}

        {/* STEP 4: JURISDICTION */}
        {step === 4 && (
          <div className="animate-fade-in">
            <button onClick={prevStep} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-gold mb-6 transition-colors">
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Back
            </button>
            <h3 className="text-3xl md:text-4xl font-display font-semibold text-navy mb-4">Current Location</h3>
            <p className="text-slate mb-10">Where are you currently based?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'United Kingdom', flag: '🇬🇧' },
                { id: 'Europe', flag: '🇪🇺' },
                { id: 'North America', flag: '🇺🇸' },
                { id: 'Asia Pacific', flag: '🇸🇬' },
                { id: 'Other', flag: '🌐' }
              ].map((j) => (
                <button
                  key={j.id}
                  onClick={() => { setFormData({...formData, jurisdiction: j.id as Jurisdiction}); setTimeout(nextStep, 300); }}
                  className={`p-6 text-left rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${formData.jurisdiction === j.id ? 'border-gold bg-gold/5' : 'border-slate-100 hover:border-gold/30'}`}
                >
                  <span className="text-3xl">{j.flag}</span>
                  <span className={`text-lg font-medium ${formData.jurisdiction === j.id ? 'text-navy' : 'text-slate'}`}>{j.id}</span>
                  {formData.jurisdiction === j.id && <div className="ml-auto text-gold"><ICONS.CheckCircle /></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: CONTACT */}
        {step === 5 && (
          <div className="animate-fade-in">
            <button onClick={prevStep} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-gold mb-6 transition-colors">
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Back
            </button>
            <h3 className="text-3xl md:text-4xl font-display font-semibold text-navy mb-4">Your Details</h3>
            <p className="text-slate mb-10">We'll use these details to contact you within 24 hours.</p>

            <div className="space-y-6">
              <input
                type="text"
                required
                className={inputClass}
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="email"
                  required
                  className={inputClass}
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="Phone (Optional)"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <textarea
                className={`${inputClass} h-24 resize-none`}
                placeholder="Any specific requirements or questions?"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />

              <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate">
                Your information is protected and will only be used to contact you regarding your consultation request.
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.email}
                className={`w-full py-4 rounded-lg font-semibold uppercase tracking-wider text-sm transition-all ${formData.name && formData.email ? 'btn-primary' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
              >
                Submit Request
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ICONS.Shield />
          <span>Secure & Confidential</span>
        </div>
        <span>Response within 24 hours</span>
      </div>
    </div>
  );
};
