import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface QuoteRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    sector: string;
    investmentSize: string;
    dealStage: string;
    notes: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    sector?: string;
    investmentSize?: string;
    dealStage?: string;
}

export const QuoteRequestModal = ({ isOpen, onClose }: QuoteRequestModalProps) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        sector: '',
        investmentSize: '',
        dealStage: '',
        notes: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    sector: '',
                    investmentSize: '',
                    dealStage: '',
                    notes: ''
                });
                setErrors({});
                setSubmitError(null);
                setIsSuccess(false);
            }, 200);
        }
    }, [isOpen]);

    // Focus trap and escape key handler
    useEffect(() => {
        if (!isOpen) return;

        // Focus first input when modal opens
        setTimeout(() => {
            firstInputRef.current?.focus();
        }, 100);

        // Handle escape key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        // Focus trap
        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            const modal = modalRef.current;
            if (!modal) return;

            const focusableElements = modal.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement?.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement?.focus();
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('keydown', handleTab);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('keydown', handleTab);
        };
    }, [isOpen, onClose]);

    // Auto-close after success
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                onClose();
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, onClose]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.sector) {
            newErrors.sector = 'Please select a sector';
        }

        if (!formData.investmentSize) {
            newErrors.investmentSize = 'Please select investment size';
        }

        if (!formData.dealStage) {
            newErrors.dealStage = 'Please select deal stage';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // OPTION A: Web3Forms (Email notification)
            // Get your free access key from: https://web3forms.com
            // Sign up with satish@luminaq.ae to receive form submissions
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_key: 'f8513014-6701-46de-9413-d8da170eb01e',
                    subject: 'New Quote Request from Luminaq Website',
                    from_name: formData.name,
                    email: formData.email,
                    to: 'satish@luminaq.ae',
                    botcheck: false, // Honeypot spam protection
                    message: `
New Quote Request from Luminaq Website

Name: ${formData.name}
Email: ${formData.email}
Phone/WhatsApp: ${formData.phone || 'Not provided'}
Sector: ${formData.sector}
Investment Size: ${formData.investmentSize}
Deal Stage: ${formData.dealStage}
Additional Notes: ${formData.notes || 'None'}

Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })} (Dubai time)
                    `.trim()
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Form submission failed');
            }

            // OPTION B: Google Sheets
            // Uncomment and add your Google Apps Script webhook URL
            /*
            const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                timestamp: new Date().toISOString(),
                ...formData
              })
            });
            */

            // OPTION C: Generic Webhook (n8n, Make, Zapier)
            // Uncomment and add your webhook URL
            /*
            const response = await fetch('YOUR_WEBHOOK_URL', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                timestamp: new Date().toISOString(),
                ...formData
              })
            });
      
            if (!response.ok) {
              throw new Error('Form submission failed');
            }
            */

            setIsSuccess(true);
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitError('Something went wrong. Please try again or email us at satish@luminaq.ae');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="quote-modal-title"
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-black/70"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    ref={modalRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-luminaq-card border border-luminaq-border w-full max-w-[640px] max-h-[90vh] overflow-y-auto shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-luminaq-muted hover:text-luminaq-accent transition-colors z-10"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>

                    {isSuccess ? (
                        // Success State
                        <div className="p-12 md:p-16 text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-luminaq-accent/20 flex items-center justify-center">
                                    <Check size={32} className="text-luminaq-accent" />
                                </div>
                            </div>
                            <h2 className="font-serif text-2xl md:text-3xl text-luminaq-accent mb-4">
                                Quote Request Received
                            </h2>
                            <p className="text-luminaq-text text-base md:text-lg mb-6 leading-relaxed">
                                We'll review your deal details and send a fixed-price quote within 24 hours — usually sooner. Check your inbox.
                            </p>
                            <p className="text-luminaq-muted text-sm mb-8">
                                Meanwhile,{' '}
                                <a
                                    href="/ai-pitch-decoder.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-luminaq-accent hover:text-luminaq-accentHover underline"
                                >
                                    download our free AI Pitch Decoder
                                </a>{' '}
                                to prepare your questions.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 border-2 border-luminaq-accent text-luminaq-accent hover:bg-luminaq-accent hover:text-white transition-all rounded-[4px] font-medium"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        // Form State
                        <div className="p-8 md:p-12">
                            {/* Header */}
                            <div className="mb-8">
                                <span className="text-luminaq-accent text-xs font-medium uppercase tracking-[3px] block mb-3">
                                    REQUEST A QUOTE
                                </span>
                                <h2 id="quote-modal-title" className="font-serif text-3xl md:text-4xl text-luminaq-text mb-3">
                                    Tell Us About Your Deal
                                </h2>
                                <p className="text-luminaq-muted text-sm md:text-base mb-4">
                                    We'll review and send you a fixed-price quote within 24 hours.
                                </p>
                                <div className="w-[60px] h-[1px] bg-luminaq-accent" />
                            </div>

                            {/* Error Banner */}
                            {submitError && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[4px]">
                                    <p className="text-red-600 text-sm">{submitError}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Row 1: Name and Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-luminaq-text text-sm font-semibold mb-2">
                                            Your Name <span className="text-luminaq-accent">*</span>
                                        </label>
                                        <input
                                            ref={firstInputRef}
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Full name"
                                            className={`w-full px-4 py-3 bg-luminaq-elevated border ${errors.name ? 'border-red-500' : 'border-luminaq-border'
                                                } rounded-[4px] text-luminaq-text placeholder-luminaq-muted focus:outline-none focus:border-luminaq-accent transition-colors`}
                                        />
                                        {errors.name && <p className="mt-1 text-red-500 text-xs">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-luminaq-text text-sm font-semibold mb-2">
                                            Email <span className="text-luminaq-accent">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className={`w-full px-4 py-3 bg-luminaq-elevated border ${errors.email ? 'border-red-500' : 'border-luminaq-border'
                                                } rounded-[4px] text-luminaq-text placeholder-luminaq-muted focus:outline-none focus:border-luminaq-accent transition-colors`}
                                        />
                                        {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Row 2: Phone and Sector */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className="block text-luminaq-text text-sm font-semibold mb-2">
                                            Phone / WhatsApp <span className="text-luminaq-muted font-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+971 ..."
                                            className="w-full px-4 py-3 bg-luminaq-elevated border border-luminaq-border rounded-[4px] text-luminaq-text placeholder-luminaq-muted focus:outline-none focus:border-luminaq-accent transition-colors"
                                        />
                                        <p className="mt-1 text-luminaq-muted text-xs">Optional — many clients prefer WhatsApp</p>
                                    </div>

                                    <div>
                                        <label htmlFor="sector" className="block text-luminaq-text text-sm font-semibold mb-2">
                                            What sector is the startup in? <span className="text-luminaq-accent">*</span>
                                        </label>
                                        <select
                                            id="sector"
                                            name="sector"
                                            value={formData.sector}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-luminaq-elevated border ${errors.sector ? 'border-red-500' : 'border-luminaq-border'
                                                } rounded-[4px] text-luminaq-text focus:outline-none focus:border-luminaq-accent transition-colors`}
                                        >
                                            <option value="">Select sector</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="FinTech">FinTech</option>
                                            <option value="EdTech">EdTech</option>
                                            <option value="SaaS">SaaS</option>
                                            <option value="Logistics">Logistics</option>
                                            <option value="E-Commerce">E-Commerce</option>
                                            <option value="Cybersecurity">Cybersecurity</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.sector && <p className="mt-1 text-red-500 text-xs">{errors.sector}</p>}
                                    </div>
                                </div>

                                {/* Row 3: Investment Size and Deal Stage */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="investmentSize" className="block text-luminaq-text text-sm font-semibold mb-2">
                                            Investment size <span className="text-luminaq-accent">*</span>
                                        </label>
                                        <select
                                            id="investmentSize"
                                            name="investmentSize"
                                            value={formData.investmentSize}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-luminaq-elevated border ${errors.investmentSize ? 'border-red-500' : 'border-luminaq-border'
                                                } rounded-[4px] text-luminaq-text focus:outline-none focus:border-luminaq-accent transition-colors`}
                                        >
                                            <option value="">Select range</option>
                                            <option value="Under $50K">Under $50K</option>
                                            <option value="$50K – $150K">$50K – $150K</option>
                                            <option value="$150K – $500K">$150K – $500K</option>
                                            <option value="$500K – $1M">$500K – $1M</option>
                                            <option value="Above $1M">Above $1M</option>
                                        </select>
                                        {errors.investmentSize && <p className="mt-1 text-red-500 text-xs">{errors.investmentSize}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="dealStage" className="block text-luminaq-text text-sm font-semibold mb-2">
                                            Deal stage <span className="text-luminaq-accent">*</span>
                                        </label>
                                        <select
                                            id="dealStage"
                                            name="dealStage"
                                            value={formData.dealStage}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-luminaq-elevated border ${errors.dealStage ? 'border-red-500' : 'border-luminaq-border'
                                                } rounded-[4px] text-luminaq-text focus:outline-none focus:border-luminaq-accent transition-colors`}
                                        >
                                            <option value="">Where are you in the process?</option>
                                            <option value="Just Exploring">Just Exploring</option>
                                            <option value="Evaluating a Specific Deal">Evaluating a Specific Deal</option>
                                            <option value="Term Sheet Signed">Term Sheet Signed</option>
                                            <option value="About to Close">About to Close</option>
                                        </select>
                                        {errors.dealStage && <p className="mt-1 text-red-500 text-xs">{errors.dealStage}</p>}
                                    </div>
                                </div>

                                {/* Row 4: Additional Notes */}
                                <div>
                                    <label htmlFor="notes" className="block text-luminaq-text text-sm font-semibold mb-2">
                                        Anything specific you want us to look at? <span className="text-luminaq-muted font-normal">(optional)</span>
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder="E.g., their AI claims feel too good to be true, concerned about data licensing, want to validate the tech team..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-luminaq-elevated border border-luminaq-border rounded-[4px] text-luminaq-text placeholder-luminaq-muted focus:outline-none focus:border-luminaq-accent transition-colors resize-none"
                                    />
                                </div>

                                {/* Honeypot field for bot protection - hidden from users */}
                                <input
                                    type="checkbox"
                                    name="botcheck"
                                    style={{ display: 'none' }}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-luminaq-accent hover:bg-luminaq-accentHover text-white font-bold text-sm uppercase tracking-widest rounded-[4px] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'SENDING...' : 'REQUEST QUOTE →'}
                                </button>
                            </form>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
