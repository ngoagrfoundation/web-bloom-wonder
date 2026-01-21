import { Link } from "react-router-dom";
import { GraduationCap, HeartPulse, Briefcase, ArrowRight } from "lucide-react";
import educationImage from "@/assets/education-program.jpg";
import healthcareImage from "@/assets/healthcare-program.jpg";
import livelihoodImage from "@/assets/livelihood-program.jpg";

const programs = [
  {
    icon: GraduationCap,
    title: "Education for All",
    description:
      "Providing access to quality education through community learning centers, scholarships, and after-school programs for underprivileged children.",
    image: educationImage,
    link: "/programs/education",
  },
  {
    icon: HeartPulse,
    title: "Healthcare Initiatives",
    description:
      "Organizing regular health camps, providing essential medical services, and ensuring healthcare reaches those who need it most in remote areas.",
    image: healthcareImage,
    link: "/programs/healthcare",
  },
  {
    icon: Briefcase,
    title: "Livelihood Support",
    description:
      "Empowering women and youth through skill development, vocational training, and self-help groups for sustainable income generation.",
    image: livelihoodImage,
    link: "/programs/livelihood",
  },
];

const ProgramsSection = () => {
  return (
    <section id="programs" className="py-24 section-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Programs
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our initiatives are designed to address the most pressing needs of underserved 
            communities through holistic development programs.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div
              key={program.title}
              className="card-elevated overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4">
                  <div className="w-11 h-11 rounded-full bg-card flex items-center justify-center shadow-md">
                    <program.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {program.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                  {program.description}
                </p>
                <Link
                  to={program.link}
                  className="inline-flex items-center gap-2 text-primary font-medium text-sm group/link"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
