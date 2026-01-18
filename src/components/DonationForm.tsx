import { useState } from "react";
import { Heart, Gift, Users, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const DonationForm = () => {
  const [donationType, setDonationType] = useState("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [step, setStep] = useState(1);
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

  const currentAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Handle payment integration
      console.log("Processing donation:", { donationType, amount: currentAmount, ...formData });
      alert("Thank you for your generous donation! Our team will contact you shortly to complete the payment process.");
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
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    PAN Number (for 80G receipt)
                  </label>
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    maxLength={10}
                    placeholder="XXXXX0000X"
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-colors uppercase"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
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
                    onChange={(e) =>
                      setFormData({ ...formData, dedicateDonation: e.target.checked })
                    }
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
                      onChange={(e) => setFormData({ ...formData, dedicateTo: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-colors"
                    />
                    <textarea
                      placeholder="Optional message..."
                      value={formData.dedicateMessage}
                      onChange={(e) =>
                        setFormData({ ...formData, dedicateMessage: e.target.value })
                      }
                      rows={3}
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 btn-outline"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={!currentAmount || currentAmount < 100}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? "Complete Donation" : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
