import { useState } from "react";
import { Heart, Gift, Users, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useFormSecurity } from "@/hooks/useFormSecurity";
import { toast } from "sonner";
import { loadRazorpayScript, RAZORPAY_KEY_ID, RAZORPAY_CONFIG } from "@/lib/razorpay";

const donationAmounts = [
  { amount: 500, label: "₹500", impact: "Provide school supplies for 1 child" },
  { amount: 1000, label: "₹1,000", impact: "Fund healthcare for 1 family" },
  { amount: 2500, label: "₹2,500", impact: "Support livelihood training" },
  { amount: 5000, label: "₹5,000", impact: "Sponsor complete education" },
  { amount: 10000, label: "₹10,000", impact: "Transform a community" },
];

const donationTypes = [
  { id: "one-time", label: "One-Time", icon: Heart },
  { id: "monthly", label: "Monthly", icon: Gift },
  { id: "sponsor", label: "Sponsor", icon: Users },
];

// Validation schemas
const step2Schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || /^[6-9]\d{9}$/.test(val),
      "Please enter a valid 10-digit phone number"
    ),
  panNumber: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val),
      "Please enter a valid PAN number (e.g., ABCDE1234F)"
    ),
});

const DonationForm = () => {
  const [donationType, setDonationType] = useState("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    panNumber: "",
    anonymous: false,
    dedicateDonation: false,
    dedicateTo: "",
    dedicateMessage: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    honeypotProps,
    validateSubmission,
    recordSubmission,
    isCooldown,
    cooldownRemaining,
  } = useFormSecurity({ minSubmitTimeSeconds: 3, cooldownMs: 60000 });

  const currentAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const validateStep2 = (): boolean => {
    const result = step2Schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: "",
      email: "",
      phone: "",
      panNumber: "",
      anonymous: false,
      dedicateDonation: false,
      dedicateTo: "",
      dedicateMessage: "",
    });
    setSelectedAmount(1000);
    setCustomAmount("");
    setErrors({});
  };

  const handlePayment = async () => {
    if (!currentAmount || currentAmount < 100) {
      toast.error("Minimum donation amount is ₹100");
      return;
    }

    if (!validateSubmission()) {
      toast.error("Please wait before submitting again");
      return;
    }

    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: currentAmount * 100, // Razorpay expects amount in paise
        currency: RAZORPAY_CONFIG.currency,
        name: RAZORPAY_CONFIG.name,
        description: `${donationType.charAt(0).toUpperCase() + donationType.slice(1)} Donation`,
        image: RAZORPAY_CONFIG.image,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone || undefined,
        },
        notes: {
          donation_type: donationType,
          pan_number: formData.panNumber || "Not provided",
          anonymous: formData.anonymous ? "Yes" : "No",
          dedicated_to: formData.dedicateTo || "Not dedicated",
          dedication_message: formData.dedicateMessage || "",
        },
        theme: RAZORPAY_CONFIG.theme,
        handler: (response: { razorpay_payment_id: string }) => {
          // Payment successful
          recordSubmission();
          toast.success(
            `Thank you for your generous donation! Payment ID: ${response.razorpay_payment_id.slice(0, 12)}...`
          );
          resetForm();
          setIsProcessing(false);
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
          escape: true,
          animation: true,
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on("payment.failed", (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 2) {
      if (!validateStep2()) return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final step - initiate payment
      handlePayment();
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? <Check size={20} /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 md:w-24 h-1 mx-2 transition-colors ${
                  step > s ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Honeypot field */}
        <input {...honeypotProps} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Donation Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Select Donation Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {donationTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setDonationType(type.id)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        donationType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <type.icon
                        size={24}
                        className={donationType === type.id ? "text-primary" : "text-muted-foreground"}
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Select Amount
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {donationAmounts.map((option) => (
                    <button
                      key={option.amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(option.amount);
                        setCustomAmount("");
                      }}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedAmount === option.amount && !customAmount
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="block text-lg font-bold text-foreground">
                        {option.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {option.impact}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Enter custom amount (min ₹100)"
                    value={customAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Limit input
                      if (value.length <= 8) {
                        setCustomAmount(value);
                        setSelectedAmount(null);
                      }
                    }}
                    min={100}
                    max={10000000}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:border-primary focus:outline-none transition-colors ${
                      errors.name ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={255}
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:border-primary focus:outline-none transition-colors ${
                      errors.email ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleChange("phone", value);
                    }}
                    placeholder="10-digit number"
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:border-primary focus:outline-none transition-colors ${
                      errors.phone ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    PAN Number (for 80G receipt)
                  </label>
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => handleChange("panNumber", e.target.value.toUpperCase())}
                    maxLength={10}
                    placeholder="XXXXX0000X"
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:border-primary focus:outline-none transition-colors uppercase ${
                      errors.panNumber ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.panNumber && (
                    <p className="mt-1 text-sm text-destructive">{errors.panNumber}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.anonymous}
                  onChange={(e) => handleChange("anonymous", e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="anonymous" className="text-sm text-foreground">
                  Make my donation anonymous
                </label>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Dedication Option */}
              <div className="p-6 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="dedicate"
                    checked={formData.dedicateDonation}
                    onChange={(e) => handleChange("dedicateDonation", e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="dedicate" className="text-sm font-medium text-foreground">
                    Dedicate this donation in honor/memory of someone
                  </label>
                </div>
                {formData.dedicateDonation && (
                  <div className="space-y-4 mt-4">
                    <input
                      type="text"
                      placeholder="In honor/memory of..."
                      value={formData.dedicateTo}
                      onChange={(e) => handleChange("dedicateTo", e.target.value)}
                      maxLength={100}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-colors"
                    />
                    <textarea
                      placeholder="Optional message..."
                      value={formData.dedicateMessage}
                      onChange={(e) => handleChange("dedicateMessage", e.target.value)}
                      rows={3}
                      maxLength={500}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="p-6 bg-primary/5 rounded-xl border-2 border-primary/20">
                <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                  Donation Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Donation Type:</span>
                    <span className="font-medium capitalize">{donationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-primary text-lg">
                      ₹{currentAmount?.toLocaleString()}
                    </span>
                  </div>
                  {formData.name && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Donor:</span>
                      <span className="font-medium">
                        {formData.anonymous ? "Anonymous" : formData.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground text-center">
                  🔒 Secure payment powered by Razorpay. You'll be redirected to complete payment via UPI, Card, Net Banking, or Wallet.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={isProcessing}
              className="flex-1 btn-outline disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={!currentAmount || currentAmount < 100 || isCooldown || isProcessing}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : step === 3 ? (
              isCooldown ? (
                `Please wait ${cooldownRemaining}s`
              ) : (
                "Complete Donation"
              )
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
