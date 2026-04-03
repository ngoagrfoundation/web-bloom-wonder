import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  actionLabel: string;
}

const SUCCESS_MESSAGE = "We will get back to you within 24 hr.";

const FormSuccessDialog = ({
  open,
  onOpenChange,
  title,
  actionLabel,
}: FormSuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-0 p-0 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-br from-primary via-primary to-primary/80 px-6 py-6 text-primary-foreground">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <CheckCircle2 className="h-9 w-9" />
          </div>
        </div>

        <div className="px-6 pb-6 pt-5">
          <DialogHeader className="items-center text-center">
            <DialogTitle className="text-2xl">{title}</DialogTitle>
            <DialogDescription className="text-base leading-7 text-muted-foreground">
              {SUCCESS_MESSAGE}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 sm:justify-center">
            <Button onClick={() => onOpenChange(false)} className="min-w-44 rounded-xl">
              {actionLabel}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormSuccessDialog;
