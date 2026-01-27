import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Loader2, CheckCircle, Shield, Heart } from "lucide-react";
import { adoptStudentFormSchema, AdoptStudentFormData } from "@/lib/validation";
import { useGoogleSheetForm } from "@/hooks/useGoogleSheetForm";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbze9LbMP1Ce3AirPUbDPLp1ZGusY6SgmvZ57hcOOxYSAvKabL2EULALHuK_peKL7k8r/exec";

const gradeLevels = [
  { id: "primary", label: "Primary (1-5)" },
  { id: "middle", label: "Middle School (6-8)" },
  { id: "high", label: "High School (9-12)" },
  { id: "any", label: "Any Grade Level" },
];

const durations = [
  { id: "1-year", label: "1 Year" },
  { id: "2-years", label: "2 Years" },
  { id: "3-years", label: "3 Years" },
  { id: "until-graduation", label: "Until Graduation" },
];

interface AdoptStudentFormProps {
  onSuccess?: () => void;
}

const AdoptStudentForm = ({ onSuccess: onSuccessCallback }: AdoptStudentFormProps) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const { submitForm, isSubmitting, security } = useGoogleSheetForm({
    scriptUrl: SCRIPT_URL,
    onSuccess: () => {
      setShowSuccess(true);
      reset();
      onSuccessCallback?.();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdoptStudentFormData>({
    resolver: zodResolver(adoptStudentFormSchema),
    defaultValues: {
      sponsorName: "",
      email: "",
      phone: "",
      city: "",
      gradeLevel: "",
      duration: "",
      message: "",
    },
  });

  const gradeLevel = watch("gradeLevel");
  const duration = watch("duration");

  const onSubmit = async (data: AdoptStudentFormData) => {
    const gradeLevelLabel = gradeLevels.find(g => g.id === data.gradeLevel)?.label || data.gradeLevel;
    const durationLabel = durations.find(d => d.id === data.duration)?.label || data.duration;
    
    await submitForm({
      sponsorName: data.sponsorName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      gradeLevel: gradeLevelLabel,
      duration: durationLabel,
      message: data.message || "",
    });
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
              <h3 className="font-semibold text-primary-foreground">Registration Complete!</h3>
              <p className="text-sm text-primary-foreground/80">Thank you for your generosity</p>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-foreground mb-2">Thank You for Adopting a Student!</h4>
          <p className="text-muted-foreground mb-6">
            Your sponsorship will transform a child's future. Our team will contact you within 48 hours with the student's details.
          </p>
          <Button onClick={() => setShowSuccess(false)} variant="outline">
            Sponsor Another Student
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
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground">Adopt a Student</h3>
            <p className="text-sm text-primary-foreground/80">Sponsor a child's education journey</p>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="px-6 py-4 bg-accent/30 border-b border-border">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Your Impact:</strong> By sponsoring a student, you provide educational materials, uniforms, and support for their academic journey. You'll receive updates on their progress.
        </p>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Honeypot field */}
        <input {...security.honeypotProps} />

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sponsorName" className="text-foreground">
              Your Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sponsorName"
              placeholder="Your full name"
              {...register("sponsorName")}
              className={errors.sponsorName ? "border-destructive" : ""}
            />
            {errors.sponsorName && (
              <p className="text-sm text-destructive">{errors.sponsorName.message}</p>
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
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="9876543210"
              {...register("phone")}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-foreground">
              City <span className="text-destructive">*</span>
            </Label>
            <Input
              id="city"
              placeholder="Your city"
              {...register("city")}
              className={errors.city ? "border-destructive" : ""}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gradeLevel" className="text-foreground">
              Preferred Grade Level <span className="text-destructive">*</span>
            </Label>
            <Select
              value={gradeLevel}
              onValueChange={(value) => setValue("gradeLevel", value, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.gradeLevel ? "border-destructive" : ""}>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {gradeLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gradeLevel && (
              <p className="text-sm text-destructive">{errors.gradeLevel.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-foreground">
              Sponsorship Duration <span className="text-destructive">*</span>
            </Label>
            <Select
              value={duration}
              onValueChange={(value) => setValue("duration", value, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.duration ? "border-destructive" : ""}>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((dur) => (
                  <SelectItem key={dur.id} value={dur.id}>
                    {dur.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.duration && (
              <p className="text-sm text-destructive">{errors.duration.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-foreground">
            Message (Optional)
          </Label>
          <Textarea
            id="message"
            placeholder="Any specific preferences or message for the student..."
            rows={3}
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
              Submitting...
            </>
          ) : security.isCooldown ? (
            `Please wait ${security.cooldownRemaining}s`
          ) : (
            <>
              <GraduationCap className="w-4 h-4 mr-2" />
              Submit Sponsorship Request
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

export default AdoptStudentForm;
