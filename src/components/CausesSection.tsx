import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";
import CauseCard from "./CauseCard";

const causes = [
  {
    title: "Cleaning the Lake at Temple",
    description: "Restoring the sacred temple lake by removing waste and pollution to preserve our cultural heritage.",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=600&h=400&fit=crop",
    goal: 50000,
    raised: 32000,
    link: "/causes/lake-cleaning",
  },
  {
    title: "Treatment of a Physically Challenged Student",
    description: "Providing medical treatment and rehabilitation support for a student in need of specialized care.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop",
    goal: 75000,
    raised: 45000,
    link: "/causes/physically-challenged-treatment",
  },
  {
    title: "Water Filter at a School",
    description: "Installing clean water filtration systems to provide safe drinking water for 500+ students.",
    image: "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=600&h=400&fit=crop",
    goal: 35000,
    raised: 28000,
    link: "/causes/water-filter-school",
  },
  {
    title: "Wheelchair for a Student",
    description: "Providing mobility equipment to help a disabled student attend school and live independently.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    goal: 15000,
    raised: 12000,
    link: "/causes/wheelchair-student",
  },
  {
    title: "Wheelchair for an Elderly Person",
    description: "Supporting an elderly person with mobility equipment to improve their quality of life.",
    image: "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&h=400&fit=crop",
    goal: 12000,
    raised: 8500,
    link: "/causes/wheelchair-elderly",
  },
];

const CausesSection = () => {
  return (
    <section id="causes" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fadeUp" className="text-center mb-14">
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">
            Make a Difference
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Our Active Causes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Support our ongoing initiatives and help transform lives. Every contribution,
            no matter how small, creates a ripple of positive change in our communities.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause, index) => (
            <StaggerItem key={index}>
              <CauseCard {...cause} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default CausesSection;
