import {
  HandHeart,
  Users,
  GraduationCap,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

const involvementOptions = [
  {
    icon: HandHeart,
    title: "Volunteer",
    description:
      "Give your time and skills to make a difference. Join our volunteer network.",
    buttonText: "Volunteer Now",
    buttonHref: "#contact",
  },
  {
    icon: Users,
    title: "Partner with Us",
    description:
      "Collaborate with us to amplify impact. Corporate and NGO partnerships welcome.",
    buttonText: "Become a Partner",
    buttonHref: "#contact",
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
    buttonHref: "#contact",
  },
  {
    icon: DollarSign,
    title: "Donate",
    description:
      "Your contribution, no matter the size, creates real impact in communities.",
    buttonText: "Donate Now",
    buttonHref: "#donate",
    featured: true,
  },
];

const GetInvolvedSection = () => {
  return (
    <section id="get-involved" className="py-20 section-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get Involved
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            There are many ways to join our mission. Find the one that's right for you.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {involvementOptions.map((option, index) => (
            <div
              key={option.title}
              className={`card-elevated p-6 text-center ${
                option.featured
                  ? "lg:col-span-1 md:col-span-2 lg:col-span-1 border-2 border-secondary"
                  : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  option.featured ? "bg-secondary" : "bg-muted"
                }`}
              >
                <option.icon
                  className={`w-8 h-8 ${
                    option.featured ? "text-secondary-foreground" : "text-primary"
                  }`}
                />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {option.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {option.description}
              </p>
              <a
                href={option.buttonHref}
                className={option.featured ? "btn-secondary inline-block" : "btn-outline inline-block text-sm"}
              >
                {option.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedSection;
