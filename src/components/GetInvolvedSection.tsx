import {
  HandHeart,
  Users,
  GraduationCap,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

const involvementOptions = [
  {
    icon: HandHeart,
    title: "Volunteer",
    description:
      "Give your time and skills to make a difference. Join our volunteer network.",
    buttonText: "Volunteer Now",
    buttonHref: "#volunteer",
  },
  {
    icon: Users,
    title: "Partner with Us",
    description:
      "Collaborate with us to amplify impact. Corporate and NGO partnerships welcome.",
    buttonText: "Become a Partner",
    buttonHref: "#partner",
  },
  {
    icon: GraduationCap,
    title: "Adopt a Student",
    description:
      "Sponsor a child's education and be a part of their journey towards success.",
    buttonText: "Sponsor Now",
    buttonHref: "#contact",
  },
  {
    icon: AlertTriangle,
    title: "Report a Challenge",
    description:
      "Know a community in need? Report issues and help us reach more people.",
    buttonText: "Report Now",
    buttonHref: "#report-challenge",
  },
  {
    icon: Heart,
    title: "Donate",
    description:
      "Your contribution, no matter the size, creates real impact in communities.",
    buttonText: "Donate Now",
    buttonHref: "/donate",
    featured: true,
  },
];

const GetInvolvedSection = () => {
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
                  to={option.buttonHref}
                  className="inline-block bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors px-5 py-2.5 rounded-lg font-medium text-sm"
                >
                  {option.buttonText}
                </Link>
              ) : (
                <a
                  href={option.buttonHref}
                  className="inline-block text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                >
                  {option.buttonText} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedSection;
