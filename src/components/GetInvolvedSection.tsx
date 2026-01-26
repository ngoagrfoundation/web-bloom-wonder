import { useState } from "react";
import {
  HandHeart,
  Users,
  GraduationCap,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import VolunteerForm from "@/components/forms/VolunteerForm";
import PartnerForm from "@/components/forms/PartnerForm";
import ReportChallengeForm from "@/components/forms/ReportChallengeForm";

type ModalType = "volunteer" | "partner" | "report" | null;

const involvementOptions = [
  {
    icon: HandHeart,
    title: "Volunteer",
    description:
      "Give your time and skills to make a difference. Join our volunteer network.",
    buttonText: "Volunteer Now",
    modalType: "volunteer" as ModalType,
  },
  {
    icon: Users,
    title: "Partner with Us",
    description:
      "Collaborate with us to amplify impact. Corporate and NGO partnerships welcome.",
    buttonText: "Become a Partner",
    modalType: "partner" as ModalType,
  },
  {
    icon: GraduationCap,
    title: "Adopt a Student",
    description:
      "Sponsor a child's education and be a part of their journey towards success.",
    buttonText: "Sponsor Now",
    href: "#contact",
  },
  {
    icon: AlertTriangle,
    title: "Report a Challenge",
    description:
      "Know a community in need? Report issues and help us reach more people.",
    buttonText: "Report Now",
    modalType: "report" as ModalType,
  },
  {
    icon: Heart,
    title: "Donate",
    description:
      "Your contribution, no matter the size, creates real impact in communities.",
    buttonText: "Donate Now",
    href: "/donate",
    featured: true,
  },
];

const GetInvolvedSection = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleCardClick = (option: typeof involvementOptions[0]) => {
    if (option.modalType) {
      setActiveModal(option.modalType);
    }
  };

  const closeModal = () => setActiveModal(null);

  return (
    <section id="get-involved" className="py-24 section-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get Involved
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            There are many ways to join our mission. Find the one that's right for you.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {involvementOptions.map((option) => (
            <div
              key={option.title}
              className={`card-elevated p-6 text-center ${
                option.featured
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center ${
                  option.featured ? "bg-primary-foreground/20" : "bg-muted"
                }`}
              >
                <option.icon
                  className={`w-6 h-6 ${
                    option.featured ? "text-primary-foreground" : "text-primary"
                  }`}
                />
              </div>
              <h3 className={`font-display text-xl font-semibold mb-2 ${
                option.featured ? "text-primary-foreground" : "text-foreground"
              }`}>
                {option.title}
              </h3>
              <p className={`text-sm mb-5 leading-relaxed ${
                option.featured ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}>
                {option.description}
              </p>
              {option.featured ? (
                <Link
                  to={option.href!}
                  className="inline-block bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors px-5 py-2.5 rounded-lg font-medium text-sm"
                >
                  {option.buttonText}
                </Link>
              ) : option.modalType ? (
                <button
                  onClick={() => handleCardClick(option)}
                  className="inline-block text-primary hover:text-primary/80 font-medium text-sm transition-colors cursor-pointer"
                >
                  {option.buttonText} →
                </button>
              ) : (
                <a
                  href={option.href}
                  className="inline-block text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                >
                  {option.buttonText} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer Modal */}
      <Dialog open={activeModal === "volunteer"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Become a Volunteer</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[90vh]">
            <VolunteerForm onSuccess={closeModal} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Partner Modal */}
      <Dialog open={activeModal === "partner"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Partner with Us</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[90vh]">
            <PartnerForm onSuccess={closeModal} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Report Challenge Modal */}
      <Dialog open={activeModal === "report"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Report a Challenge</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[90vh]">
            <ReportChallengeForm onSuccess={closeModal} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GetInvolvedSection;
