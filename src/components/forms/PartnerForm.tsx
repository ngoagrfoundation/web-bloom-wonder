import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Handshake, Loader2, CheckCircle, Shield, Clock } from "lucide-react";
import { partnerFormSchema, PartnerFormData } from "@/lib/validation";
import { useGoogleSheetForm } from "@/hooks/useGoogleSheetForm";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzMHieEiY7wAX6btCmNCrPtPhBr63B3xUI6sDlAeUX6Z8I_WdLNULdmGDaWcSzAW9_O/exec";

const organizationTypes = [
  { id: "corporate", label: "Corporate / Business" },
  { id: "ngo", label: "NGO / Non-Profit" },
  { id: "government", label: "Government Body" },
  { id: "educational", label: "Educational Institution" },
  { id: "community", label: "Community Organization" },
  { id: "other", label: "Other" },
];

const partnershipInterests = [
  { id: "csr", label: "CSR Initiatives" },
  { id: "joint-programs", label: "Joint Programs" },
  { id: "resource-sharing", label: "Resource Sharing" },
  { id: "funding", label: "Funding Support" },
  { id: "skill-development", label: "Skill Development" },
  { id: "awareness", label: "Awareness Campaigns" },
];

interface PartnerFormProps {
  onSuccess?: () => void;
}

const PartnerForm = ({ onSuccess: onSuccessCallback }: PartnerFormProps) => {
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
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      organizationName: "",
      contactPerson: "",
      email: "",
      phone: "",
      organizationType: "",
      partnershipInterest: [],
      message: "",
    },
  });

  const onSubmit = async (data: PartnerFormData) => {
    const orgTypeLabel = organizationTypes.find(t => t.id === data.organizationType)?.label || data.organizationType;
    await submitForm({
      ...data,
      organizationType: orgTypeLabel,
      partnershipInterest: data.partnershipInterest.map(id => 
        partnershipInterests.find(p => p.id === id)?.label || id
      ).join(", "),
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
              <h3 className="font-semibold text-primary-foreground">Inquiry Received!</h3>
              <p className="text-sm text-primary-foreground/80">We'll be in touch soon</p>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-foreground mb-2">Thank You for Your Interest!</h4>
          <p className="text-muted-foreground mb-6">
            We're excited about the potential partnership. Our team will review your inquiry and contact you within 48 hours.
          </p>
          <Button onClick={() => setShowSuccess(false)} variant="outline">
            Submit Another Inquiry
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
            <Handshake className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground">Partnership Inquiry</h3>
            <p className="text-sm text-primary-foreground/80">Tell us about your organization</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Honeypot field */}
        <input {...security.honeypotProps} />

        <div className="space-y-2">
          <Label htmlFor="organizationName" className="text-foreground">
            Organization Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="organizationName"
            placeholder="Your organization's name"
            {...register("organizationName")}
            className={errors.organizationName ? "border-destructive" : ""}
          />
          {errors.organizationName && (
            <p className="text-sm text-destructive">{errors.organizationName.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactPerson" className="text-foreground">
              Contact Person <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contactPerson"
              placeholder="Your name"
              {...register("contactPerson")}
              className={errors.contactPerson ? "border-destructive" : ""}
            />
            {errors.contactPerson && (
              <p className="text-sm text-destructive">{errors.contactPerson.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationType" className="text-foreground">
              Organization Type <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="organizationType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={errors.organizationType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.organizationType && (
              <p className="text-sm text-destructive">{errors.organizationType.message}</p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="partnerEmail" className="text-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="partnerEmail"
              type="email"
              placeholder="contact@organization.com"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="partnerPhone" className="text-foreground">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="partnerPhone"
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

        <div className="space-y-3">
          <Label className="text-foreground">
            Partnership Interests <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="partnershipInterest"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3">
                {partnershipInterests.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`interest-${item.id}`}
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
                      htmlFor={`interest-${item.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          />
          {errors.partnershipInterest && (
            <p className="text-sm text-destructive">{errors.partnershipInterest.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="partnerMessage" className="text-foreground">
            Message / Proposal (Optional)
          </Label>
          <Textarea
            id="partnerMessage"
            placeholder="Tell us more about how you'd like to partner with us..."
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
              <Handshake className="w-4 h-4 mr-2" />
              Submit Partnership Inquiry
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
            <span>Response within 48 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerForm;
