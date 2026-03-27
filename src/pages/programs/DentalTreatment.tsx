import { Link } from "react-router-dom";
import ProgramPageLayout from "@/components/ProgramPageLayout";
import dentalImg from "@/assets/generated/programs/dental-treatment.jpg";

const DentalTreatment = () => {
  return (
    <ProgramPageLayout
      title="Dental Treatment"
      tagline="Monthly Free Dental Clinic — A Gift of Health from AGR Foundation."
      heroImage={dentalImg}
      overview="At AGR Foundation, we believe that dental health is a fundamental right, not a luxury. Financial constraints should never stand between you and a healthy smile. To build a healthier, self-sustained society, we are proud to host our Free Monthly Dental Clinic in Hyderabad. We don't just offer consultations; we provide end-to-end dental solutions. Whether it is a minor check-up or a complex procedure, our expert team is here to help."
      activities={[
        { title: "Routine Check-ups & Consultations", description: "Early detection of oral health issues through comprehensive dental examinations by qualified dentists." },
        { title: "Professional Cleaning", description: "Scaling and polishing for a healthier mouth, removing plaque and tartar buildup to prevent gum disease." },
        { title: "Fillings & Restorations", description: "Expert care for cavities and tooth decay using modern dental materials and techniques." },
        { title: "Root Canal Treatments (RCT)", description: "Comprehensive Root Canal Treatments performed by specialists to save damaged teeth and relieve pain." },
        { title: "Extractions", description: "Safe and painless removal of damaged teeth that cannot be restored, with proper aftercare guidance." },
        { title: "Oral Hygiene Education", description: "Tips on maintaining a lifelong healthy smile through proper brushing, flossing, and dietary habits." },
      ]}
      stats={[
        { value: "500+", label: "Patients Treated" },
        { value: "100%", label: "Free Treatment" },
        { value: "12+", label: "Monthly Camps" },
        { value: "6", label: "Services Offered" },
      ]}
    >
      {/* Registration CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              When & Where?
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="card-elevated p-6">
                <p className="text-primary font-bold text-lg">Date</p>
                <p className="text-muted-foreground mt-1">Every month on the 28th</p>
              </div>
              <div className="card-elevated p-6">
                <p className="text-primary font-bold text-lg">Location</p>
                <p className="text-muted-foreground mt-1">Hyderabad (Register to receive directions)</p>
              </div>
              <div className="card-elevated p-6">
                <p className="text-primary font-bold text-lg">Timing</p>
                <p className="text-muted-foreground mt-1">10:00 AM to 5:00 PM</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <p className="text-foreground font-medium mb-2">⚠️ Prior Registration is Mandatory</p>
              <p className="text-muted-foreground text-sm">
                To ensure every patient receives dedicated time and quality care, we operate on a registration-only basis. 
                We cannot accept walk-ins once our daily slots are full. Don't ignore your dental pain — secure your slot today!
              </p>
            </div>
            <a
              href="https://wa.me/917036555699?text=Hi%2C%20I%20would%20like%20to%20register%20for%20the%20Free%20Dental%20Clinic"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block"
            >
              Click Here to Register for the Free Clinic
            </a>
          </div>
        </div>
      </section>
    </ProgramPageLayout>
  );
};

export default DentalTreatment;
