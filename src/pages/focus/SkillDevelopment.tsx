import FocusPageLayout from "@/components/FocusPageLayout";
import skillDevImg from "@/assets/generated/focus/skill-development.jpg";

const SkillDevelopment = () => {
  return (
    <FocusPageLayout
      title="Skill Development"
      tagline="Empowering Hands, Sustaining Lives — Bridging Tradition with Modern Opportunity."
      heroImage={skillDevImg}
      overview="At AGR Foundation, our Skill Development initiative is built on a single mission: to make every individual self-reliant. We don't just provide training; we revive dying arts and traditional occupations (Kula Vruthi), transforming them into sustainable livelihoods that help people stand on their own feet."
      whyItMatters="Our goal is to build a society where every individual has the skills to thrive, the resources to grow, and the dignity of standing on their own feet. We don't just teach a skill; we build a bridge to the market — from Skill Identification, recognizing natural talents and traditional crafts, to Professional Training with tools, quality standards, and business knowledge needed to compete."
      initiatives={[
        { title: "Modern Earthenware", description: "Training potters to create aesthetic and functional clay cookware, providing natural, healthy products for society while creating stable business opportunities for the Kummari community." },
        { title: "Natural Leaf-Craft", description: "Teaching the art of making Vistarakulu (leaf plates) and utility items from palm and silver oak leaves, turning agricultural waste into a profitable, plastic-free business." },
        { title: "Panchagavya Enterprises", description: "Empowering workers to utilize cow dung and urine to create organic incense sticks (Agarbatti), natural fertilizers, and floor cleaners, creating a circular economy around Goshalas." },
        { title: "Drone Pilot Training", description: "Training rural youth to become certified Drone Pilots. By using drones to spray organic fertilizers, we ensure precision, save time, and protect our environment and honey bees from chemical exposure." },
        { title: "Value-Added Farming Skills", description: "Training in specialized techniques like Sprouted Garlic production and Apiculture (Beekeeping), ensuring farmers have multiple streams of income and produce high-quality, medicinal-grade honey." },
        { title: "Authentic Millet Production", description: "Supporting village women in the large-scale production of unadulterated Jonna Rotte (Sorghum flatbreads), providing employment while ensuring urban families access pure, chemical-free, nutritious food." },
      ]}
      stats={[
        { value: "1,000+", label: "Youth Trained" },
        { value: "15+", label: "Skill Programs" },
        { value: "75%", label: "Employment Rate" },
        { value: "100+", label: "Businesses Started" },
      ]}
      relatedCauses={[
        { title: "Women's Empowerment", link: "/focus/womens-empowerment" },
        { title: "Rural Development", link: "/focus/rural-development" },
      ]}
    />
  );
};

export default SkillDevelopment;
