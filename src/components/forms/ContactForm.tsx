import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2, CheckCircle, Shield } from "lucide-react";
import { contactFormSchema, ContactFormData } from "@/lib/validation";
import { useGoogleSheetForm } from "@/hooks/useGoogleSheetForm";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwMjOuB2s6bd_bTuxT98-U5ioSbgmmyqv_5_DiH_WALJI4-ZdMVRAyggNNRTq84Ci1EqQ/exec";

const ContactForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { submitForm, isSubmitting, security } = useGoogleSheetForm({
    scriptUrl: SCRIPT_URL,
    onSuccess: () => {
      setShowSuccess(true);
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    await submitForm(data);
  };

  if (showSuccess) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-xl border border-border bg-background">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">Message Sent!</h3>
              <p className="text-sm text-primary-foreground/80">Thank you for reaching out</p>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-foreground mb-2">Thank You!</h4>
          <p className="text-muted-foreground mb-6">
            We've received your message and will get back to you within 24-48 hours.
          </p>
          <Button onClick={() => setShowSuccess(false)} variant="outline">
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-border bg-background">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Send className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground">Send us a Message</h3>
            <p className="text-sm text-primary-foreground/80">We'd love to hear from you</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Honeypot field */}
        <input {...security.honeypotProps} />

        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Your full name"
            {...register("name")}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="99999 99999"
            {...register("phone")}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-foreground">
            Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="message"
            placeholder="How can we help you?"
            rows={4}
            {...register("message")}
            className={errors.message ? "border-destructive" : ""}
          />
          {errors.message && (
            <p className="text-sm text-destructive">{errors.message.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || security.isCooldown}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : security.isCooldown ? (
            `Please wait ${security.cooldownRemaining}s`
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </form>

      {/* Form Footer */}
      <div className="px-6 py-4 bg-muted/50 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-primary" />
          <span>Your information is securely submitted</span>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
