import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Loader2, CheckCircle, Shield, Clock } from "lucide-react";
import { volunteerFormSchema, VolunteerFormData } from "@/lib/validation";
import { useGoogleSheetForm } from "@/hooks/useGoogleSheetForm";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtNe9Kpt1ESjMC_s-8j1kfr62PBDoYFD3ZWlF-auBaxuYJPPZ-w_PFvwFgFEj2ns2d/exec";

const initiatives = [
  { id: "eco-packaging", label: "Eco-Packaging Training" },
  { id: "tree-plantation", label: "Tree Plantation" },
  { id: "lake-cleaning", label: "Lake Cleaning" },
  { id: "zero-waste", label: "Zero Waste Workshops" },
  { id: "community-outreach", label: "Community Outreach" },
];

const availabilityOptions = [
  { id: "weekends", label: "Weekends" },
  { id: "weekdays", label: "Weekdays" },
  { id: "monthly-events", label: "Monthly Events" },
  { id: "special-campaigns", label: "Special Campaigns" },
];

interface VolunteerFormProps {
  onSuccess?: () => void;
}

const VolunteerForm = ({ onSuccess: onSuccessCallback }: VolunteerFormProps) => {
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
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      initiatives: [],
      availability: [],
      experience: "",
    },
  });

  const onSubmit = async (data: VolunteerFormData) => {
    await submitForm({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      location: data.location,
      initiatives: data.initiatives.map(id => 
        initiatives.find(i => i.id === id)?.label || id
      ),
      availability: data.availability.map(id => 
        availabilityOptions.find(a => a.id === id)?.label || id
      ),
      experience: data.experience || "",
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
              <p className="text-sm text-primary-foreground/80">Welcome to the team</p>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-foreground mb-2">Thank You for Volunteering!</h4>
          <p className="text-muted-foreground mb-6">
            We're excited to have you on board. Our team will contact you within 48 hours with next steps.
          </p>
          <Button onClick={() => setShowSuccess(false)} variant="outline">
            Register Another Volunteer
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
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground">Register as a Volunteer</h3>
            <p className="text-sm text-primary-foreground/80">Start making a difference today</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Honeypot field */}
        <input {...security.honeypotProps} />

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Your full name"
              {...register("fullName")}
              className={errors.fullName ? "border-destructive" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
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
            <Label htmlFor="location" className="text-foreground">
              Location/Village <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              placeholder="Your village or area"
              {...register("location")}
              className={errors.location ? "border-destructive" : ""}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-foreground">
            Which initiatives interest you? <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="initiatives"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3">
                {initiatives.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`initiative-${item.id}`}
                      checked={field.value?.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, item.id]);
                        } else {
                          field.onChange(field.value.filter((v) => v !== item.id));
                        }
                      }}
                    />
                    <Label
                      htmlFor={`initiative-${item.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          />
          {errors.initiatives && (
            <p className="text-sm text-destructive">{errors.initiatives.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-foreground">
            Availability <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="availability"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3">
                {availabilityOptions.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${item.id}`}
                      checked={field.value?.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, item.id]);
                        } else {
                          field.onChange(field.value.filter((v) => v !== item.id));
                        }
                      }}
                    />
                    <Label
                      htmlFor={`availability-${item.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          />
          {errors.availability && (
            <p className="text-sm text-destructive">{errors.availability.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience" className="text-foreground">
            Previous Experience (Optional)
          </Label>
          <Textarea
            id="experience"
            placeholder="Tell us about any relevant volunteering experience..."
            rows={3}
            {...register("experience")}
            className={errors.experience ? "border-destructive" : ""}
          />
          {errors.experience && (
            <p className="text-sm text-destructive">{errors.experience.message}</p>
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
              <Heart className="w-4 h-4 mr-2" />
              Register as Volunteer
            </>
          )}
        </Button>
      </form>

      {/* Form Footer */}
      <div className="px-6 py-4 bg-muted/50 border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>Secure submission</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>We'll contact you within 48 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerForm;
