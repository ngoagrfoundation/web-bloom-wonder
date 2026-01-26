import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, CheckCircle, Lock, Clock } from "lucide-react";
import { reportChallengeFormSchema, ReportChallengeFormData } from "@/lib/validation";
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

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxGarQhnIT59zLST4iR_IsKBOJQvcOi0xFCwWjnoVxl7aDkevKXBJnm_ctXbOpSF8T4/exec";

const challengeTypes = [
  { id: "healthcare", label: "Healthcare Access" },
  { id: "education", label: "Education Barriers" },
  { id: "infrastructure", label: "Infrastructure Issues" },
  { id: "environment", label: "Environmental Concerns" },
  { id: "livelihood", label: "Livelihood Support" },
  { id: "water", label: "Water & Sanitation" },
  { id: "disability", label: "Disability Support" },
  { id: "other", label: "Other" },
];

interface ReportChallengeFormProps {
  onSuccess?: () => void;
}

const ReportChallengeForm = ({ onSuccess: onSuccessCallback }: ReportChallengeFormProps) => {
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
    control,
    formState: { errors },
  } = useForm<ReportChallengeFormData>({
    resolver: zodResolver(reportChallengeFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      location: "",
      challengeType: "",
      description: "",
      peopleAffected: "",
    },
  });

  const onSubmit = async (data: ReportChallengeFormData) => {
    const challengeLabel = challengeTypes.find(t => t.id === data.challengeType)?.label || data.challengeType;
    await submitForm({
      ...data,
      challengeType: challengeLabel,
    });
  };

  if (showSuccess) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-xl border border-border bg-background">
        <div className="bg-gradient-to-r from-destructive/90 to-destructive/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-destructive-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-destructive-foreground">Report Received!</h3>
              <p className="text-sm text-destructive-foreground/80">We're on it</p>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-foreground mb-2">Thank You for Reporting!</h4>
          <p className="text-muted-foreground mb-6">
            Your report has been received. Our team will review it within 24-48 hours and take appropriate action.
          </p>
          <Button onClick={() => setShowSuccess(false)} variant="outline">
            Report Another Challenge
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-border bg-background">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-destructive/90 to-destructive/70 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-destructive-foreground">Report a Challenge</h3>
            <p className="text-sm text-destructive-foreground/80">Help us reach those in need</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Honeypot field */}
        <input {...security.honeypotProps} />

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reportName" className="text-foreground">
              Your Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reportName"
              placeholder="Your name"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportPhone" className="text-foreground">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reportPhone"
              type="tel"
              placeholder="9876543210"
              {...register("phone")}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reportEmail" className="text-foreground">
              Email (Optional)
            </Label>
            <Input
              id="reportEmail"
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
            <Label htmlFor="reportLocation" className="text-foreground">
              Location/Village <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reportLocation"
              placeholder="Where is the challenge?"
              {...register("location")}
              className={errors.location ? "border-destructive" : ""}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="challengeType" className="text-foreground">
              Challenge Type <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="challengeType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={errors.challengeType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {challengeTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.challengeType && (
              <p className="text-sm text-destructive">{errors.challengeType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="peopleAffected" className="text-foreground">
              People Affected (Optional)
            </Label>
            <Input
              id="peopleAffected"
              placeholder="Approximate number"
              {...register("peopleAffected")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Please describe the challenge in detail. Include any relevant information that might help us understand and address the situation."
            rows={4}
            {...register("description")}
            className={errors.description ? "border-destructive" : ""}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || security.isCooldown}
          variant="destructive"
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
              <AlertTriangle className="w-4 h-4 mr-2" />
              Submit Report
            </>
          )}
        </Button>
      </form>

      {/* Form Footer */}
      <div className="px-6 py-4 bg-muted/50 border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 text-primary" />
            <span>Your privacy is protected</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>Reviewed within 24-48 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportChallengeForm;
