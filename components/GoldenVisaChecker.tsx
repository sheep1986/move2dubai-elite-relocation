
import React, { useState } from 'react';

type VisaPath = 'investor' | 'entrepreneur' | 'professional' | 'property' | 'student' | null;

interface Answer {
  question: string;
  value: string;
}

interface VisaResult {
  eligible: boolean;
  paths: {
    name: string;
    duration: string;
    description: string;
    requirements: string[];
    benefits: string[];
    processingTime: string;
    recommended?: boolean;
  }[];
  nextSteps: string[];
}

interface GoldenVisaCheckerProps {
  onOpenConsultation: () => void;
}

export const GoldenVisaChecker: React.FC<GoldenVisaCheckerProps> = ({ onOpenConsultation }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<VisaResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const questions = [
    {
      id: 'purpose',
      question: 'What is your primary reason for considering Dubai?',
      options: [
        { value: 'business', label: 'Start or expand a business', icon: '🏢' },
        { value: 'investment', label: 'Investment opportunities', icon: '📈' },
        { value: 'employment', label: 'Career / Employment', icon: '💼' },
        { value: 'lifestyle', label: 'Lifestyle & Tax benefits', icon: '🌴' },
        { value: 'retirement', label: 'Retirement', icon: '🏖️' },
      ]
    },
    {
      id: 'investment',
      question: 'What is your estimated investment capacity?',
      options: [
        { value: 'under500k', label: 'Under $500,000', icon: '💰' },
        { value: '500k-1m', label: '$500,000 - $1 Million', icon: '💎' },
        { value: '1m-2m', label: '$1 Million - $2 Million', icon: '🏆' },
        { value: '2m-5m', label: '$2 Million - $5 Million', icon: '👑' },
        { value: 'over5m', label: 'Over $5 Million', icon: '🌟' },
      ]
    },
    {
      id: 'profession',
      question: 'What best describes your professional background?',
      options: [
        { value: 'executive', label: 'C-Suite / Executive', icon: '👔' },
        { value: 'entrepreneur', label: 'Business Owner / Entrepreneur', icon: '🚀' },
        { value: 'specialist', label: 'Specialist / Expert', icon: '🎯' },
        { value: 'creative', label: 'Creative / Artist', icon: '🎨' },
        { value: 'scientist', label: 'Scientist / Researcher', icon: '🔬' },
        { value: 'other', label: 'Other Professional', icon: '📋' },
      ]
    },
    {
      id: 'timeline',
      question: 'When are you planning to relocate?',
      options: [
        { value: 'immediate', label: 'Within 3 months', icon: '⚡' },
        { value: 'soon', label: '3-6 months', icon: '📅' },
        { value: 'planning', label: '6-12 months', icon: '🗓️' },
        { value: 'exploring', label: 'Just exploring options', icon: '🔍' },
      ]
    },
    {
      id: 'family',
      question: 'Will you be relocating with family?',
      options: [
        { value: 'solo', label: 'Just myself', icon: '👤' },
        { value: 'spouse', label: 'With spouse/partner', icon: '👫' },
        { value: 'family', label: 'With spouse and children', icon: '👨‍👩‍👧‍👦' },
        { value: 'extended', label: 'Extended family members', icon: '👨‍👩‍👧‍👦' },
      ]
    },
  ];

  const calculateResult = (): VisaResult => {
    const purposeAnswer = answers.find(a => a.question === 'purpose')?.value;
    const investmentAnswer = answers.find(a => a.question === 'investment')?.value;
    const professionAnswer = answers.find(a => a.question === 'profession')?.value;

    const paths: VisaResult['paths'] = [];

    // Property Investment Path (AED 2M+)
    if (['1m-2m', '2m-5m', 'over5m'].includes(investmentAnswer || '')) {
      paths.push({
        name: '10-Year Golden Visa (Property)',
        duration: '10 Years',
        description: 'Obtain residency through property investment of AED 2 million or more.',
        requirements: [
          'Property investment of AED 2,000,000+ (fully paid)',
          'Valid passport',
          'Health insurance',
          'No criminal record',
        ],
        benefits: [
          '10-year renewable residency',
          'Sponsor unlimited family members',
          'No minimum stay requirement',
          'Work for any employer or freelance',
          'Access to UAE banking & business',
        ],
        processingTime: '2-4 weeks',
        recommended: true,
      });
    }

    // Investor Path
    if (['investment', 'business'].includes(purposeAnswer || '') && ['2m-5m', 'over5m'].includes(investmentAnswer || '')) {
      paths.push({
        name: '10-Year Golden Visa (Investor)',
        duration: '10 Years',
        description: 'For investors with public investments or company shareholders.',
        requirements: [
          'Investment/deposit of AED 2,000,000+',
          'Or ownership of company with capital AED 2M+',
          'Valid passport',
          'Health insurance',
        ],
        benefits: [
          '10-year renewable residency',
          'Full business ownership rights',
          'Sponsor family members',
          'Multiple entry visa',
          'No sponsor required',
        ],
        processingTime: '2-4 weeks',
        recommended: investmentAnswer === 'over5m',
      });
    }

    // Entrepreneur Path
    if (['entrepreneur', 'executive'].includes(professionAnswer || '') && ['business'].includes(purposeAnswer || '')) {
      paths.push({
        name: '10-Year Golden Visa (Entrepreneur)',
        duration: '10 Years',
        description: 'For founders of successful startups or businesses.',
        requirements: [
          'Own a startup valued at AED 2M+',
          'Or have sold a startup for AED 7M+',
          'Approval from accredited business incubator',
          'Valid passport',
        ],
        benefits: [
          '10-year renewable residency',
          'Bring business partners & employees',
          'No local sponsor needed',
          'Full company ownership',
        ],
        processingTime: '3-6 weeks',
      });
    }

    // Specialized Talent Path
    if (['specialist', 'scientist', 'creative'].includes(professionAnswer || '')) {
      paths.push({
        name: '10-Year Golden Visa (Exceptional Talent)',
        duration: '10 Years',
        description: 'For specialists, scientists, and exceptional talents in their field.',
        requirements: [
          'PhD holders or specialists in priority fields',
          'Scientists with significant research contributions',
          'Creative professionals with awards/recognition',
          'Letter of recommendation from relevant authority',
        ],
        benefits: [
          '10-year renewable residency',
          'Work independently or for any employer',
          'Sponsor family members',
          'Fast-track processing available',
        ],
        processingTime: '2-4 weeks',
      });
    }

    // Executive Path
    if (['executive'].includes(professionAnswer || '') && ['employment'].includes(purposeAnswer || '')) {
      paths.push({
        name: '10-Year Golden Visa (Executive)',
        duration: '10 Years',
        description: 'For senior executives of established companies.',
        requirements: [
          'Executive director or senior manager position',
          'Minimum salary of AED 30,000/month',
          'Bachelor\'s degree or equivalent',
          'Valid employment contract in UAE',
        ],
        benefits: [
          '10-year renewable residency',
          'Change employers without visa change',
          'Sponsor family members',
          'No minimum stay',
        ],
        processingTime: '2-4 weeks',
      });
    }

    // Standard paths for lower investment
    if (['under500k', '500k-1m'].includes(investmentAnswer || '')) {
      paths.push({
        name: 'Freelance Visa',
        duration: '1-3 Years',
        description: 'Self-sponsored visa for freelancers and independent professionals.',
        requirements: [
          'Proof of professional expertise',
          'Minimum AED 20,000 bank balance',
          'Health insurance',
          'No degree requirement for some categories',
        ],
        benefits: [
          'Self-sponsored residency',
          'Work with multiple clients',
          'Issue your own invoices',
          'Open UAE bank account',
        ],
        processingTime: '1-2 weeks',
      });

      paths.push({
        name: 'Company Formation Visa',
        duration: '2-3 Years',
        description: 'Residency through setting up a Free Zone or Mainland company.',
        requirements: [
          'Company setup (from AED 15,000)',
          'Office space (flexi-desk acceptable)',
          'Valid passport',
          'Health insurance',
        ],
        benefits: [
          'Self-sponsored residency',
          '100% business ownership',
          'Sponsor employees & family',
          'Business-friendly regulations',
        ],
        processingTime: '1-3 weeks',
      });
    }

    // Sort paths - recommended first
    paths.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));

    const nextSteps = [
      'Book a consultation to discuss your specific situation',
      'Gather required documents (passport, proof of funds, etc.)',
      'Select the visa pathway that best matches your goals',
      'Begin the application process with our guidance',
    ];

    return {
      eligible: paths.length > 0,
      paths,
      nextSteps,
    };
  };

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, { question: questions[step].id, value }];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setIsCalculating(true);
      setTimeout(() => {
        setResult(calculateResult());
        setIsCalculating(false);
      }, 1500);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setAnswers(answers.slice(0, -1));
      setStep(step - 1);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-navy p-8 md:p-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-white">Golden Visa Eligibility</h2>
            <p className="text-white/60 text-sm">Find your pathway to UAE residency in 2 minutes</p>
          </div>
        </div>

        {/* Progress Bar */}
        {!result && !isCalculating && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Question {step + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-8 md:p-12">
        {isCalculating ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
            <h3 className="text-xl font-semibold text-navy mb-2">Analyzing Your Profile</h3>
            <p className="text-slate">Finding the best visa pathways for you...</p>
          </div>
        ) : result ? (
          // Results View
          <div className="space-y-8">
            {/* Success Banner */}
            <div className={`p-6 rounded-2xl ${result.eligible ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${result.eligible ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                  {result.eligible ? (
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${result.eligible ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {result.eligible ? 'Great News! You Have Multiple Pathways' : 'Let\'s Explore Your Options'}
                  </h3>
                  <p className={result.eligible ? 'text-emerald-600' : 'text-amber-600'}>
                    {result.eligible
                      ? `Based on your profile, you qualify for ${result.paths.length} visa pathway${result.paths.length > 1 ? 's' : ''}.`
                      : 'We can help you find the right pathway with a personalized consultation.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Visa Paths */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy">Your Recommended Pathways</h3>
              {result.paths.map((path, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    path.recommended
                      ? 'border-gold bg-gold/5'
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-navy">{path.name}</h4>
                        {path.recommended && (
                          <span className="text-xs bg-gold text-white px-2 py-0.5 rounded-full font-medium">Recommended</span>
                        )}
                      </div>
                      <p className="text-sm text-slate">{path.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-display font-bold text-gold">{path.duration}</div>
                      <div className="text-xs text-slate">{path.processingTime}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs font-medium text-slate uppercase tracking-wider mb-2">Requirements</div>
                      <ul className="space-y-1">
                        {path.requirements.map((req, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-navy">
                            <svg className="w-4 h-4 text-slate mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate uppercase tracking-wider mb-2">Benefits</div>
                      <ul className="space-y-1">
                        {path.benefits.map((benefit, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-navy">
                            <svg className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-navy rounded-2xl p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Ready to Start Your Application?</h3>
              <p className="text-white/60 mb-6">Our experts will guide you through every step of the process.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onOpenConsultation}
                  className="btn-primary px-8 py-3 rounded-xl text-sm uppercase tracking-wider font-semibold"
                >
                  Book Free Consultation
                </button>
                <button
                  onClick={handleRestart}
                  className="px-8 py-3 rounded-xl text-sm uppercase tracking-wider font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Question View
          <div>
            {step > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-slate hover:text-navy transition-colors mb-6"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}

            <h3 className="text-2xl md:text-3xl font-display font-semibold text-navy mb-8">
              {questions[step].question}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {questions[step].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="p-6 rounded-2xl border-2 border-slate-100 hover:border-gold text-left transition-all duration-300 group hover:shadow-lg"
                >
                  <span className="text-3xl mb-3 block">{option.icon}</span>
                  <span className="text-lg font-medium text-navy group-hover:text-gold transition-colors">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
