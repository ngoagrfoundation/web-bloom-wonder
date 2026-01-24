import { Leaf, Recycle, TreePine, Droplets, Sun, Wind } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";

const initiatives = [
  {
    icon: Leaf,
    title: "Sustainable Materials",
    description: "Promoting biodegradable and eco-friendly materials as alternatives to plastic waste.",
  },
  {
    icon: Recycle,
    title: "Eco-Friendly Packaging",
    description: "Training communities in sustainable packaging and wrapping techniques using natural materials.",
  },
  {
    icon: TreePine,
    title: "Tree Plantation Drives",
    description: "Regular plantation programs to increase green cover and combat climate change.",
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    description: "Lake cleaning and water body restoration projects for sustainable water management.",
  },
  {
    icon: Sun,
    title: "Solar Energy Adoption",
    description: "Encouraging renewable energy solutions in rural communities for sustainable living.",
  },
  {
    icon: Wind,
    title: "Zero Waste Living",
    description: "Teaching waste reduction practices and promoting a circular economy lifestyle.",
  },
];

const SustainabilitySection = () => {
  return (
    <section id="sustainability" className="py-24 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Leaf className="w-4 h-4" />
            Eco-Friendly Living
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Environmental Sustainability
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Building a self-sustainable and eco-friendly society through community-driven initiatives 
            that promote harmony with nature.
          </p>
        </AnimatedSection>

        {/* Initiatives Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {initiatives.map((initiative, index) => (
            <StaggerItem key={index}>
              <div className="bg-background rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <initiative.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {initiative.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {initiative.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Quote Banner */}
        <AnimatedSection animation="scaleIn">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
            <blockquote className="font-display text-xl md:text-2xl text-foreground italic mb-4 leading-relaxed">
              "True development means living in harmony with nature."
            </blockquote>
            <p className="text-muted-foreground">
              Every small step towards sustainability creates a ripple effect for generations to come.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default SustainabilitySection;
