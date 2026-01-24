import FocusPageLayout from "@/components/FocusPageLayout";
import BananaLeafRequestSection from "@/components/BananaLeafRequestSection";

const EnvironmentalSafety = () => {
  return (
    <>
      <FocusPageLayout
        title="Environmental Safety"
        tagline="Building a self-sustainable and eco-friendly society through traditional wisdom and modern innovation."
        heroImage="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop"
        overview="At AGR Foundation, we believe true development means living in harmony with nature. Our environmental safety programs revive traditional eco-friendly practices like banana leaf usage, promote biodegradable alternatives to plastic, and educate communities about sustainable living. From providing banana leaves for family functions to training women in eco-friendly packaging, we're creating a movement towards a plastic-free, sustainable future."
        whyItMatters="Every plastic bag takes 500 years to decompose. Every banana leaf returns to earth in weeks. By choosing traditional, eco-friendly alternatives, we protect our water bodies, soil, and the health of future generations. Our initiatives not only preserve the environment but also create livelihoods and strengthen community bonds through shared sustainable practices."
        initiatives={[
          {
            title: "Banana Leaf Distribution",
            description: "Providing fresh banana leaves for family functions, festivals, and community gatherings as a sustainable alternative to plastic plates and disposables.",
          },
          {
            title: "Eco-Friendly Packaging Training",
            description: "Training women and youth in creating biodegradable packaging solutions using natural materials like banana leaves, palm leaves, and cloth wraps.",
          },
          {
            title: "Plastic-Free Community Drives",
            description: "Organizing awareness campaigns and providing sustainable alternatives to help communities transition away from single-use plastics.",
          },
          {
            title: "Lake & Water Body Restoration",
            description: "Cleaning and revitalizing temple tanks, ponds, and lakes to restore aquatic ecosystems and ensure clean water access for communities.",
          },
          {
            title: "Tree Plantation Programs",
            description: "Organizing banana, coconut, and native tree plantation drives to increase green cover and ensure sustainable supply of eco-friendly materials.",
          },
          {
            title: "Zero Waste Workshops",
            description: "Conducting workshops in schools and communities about waste segregation, composting, and adopting zero-waste lifestyles.",
          },
        ]}
        stats={[
          { value: "5,000+", label: "Banana Leaves Distributed" },
          { value: "200+", label: "Women Trained" },
          { value: "15+", label: "Plastic-Free Events" },
          { value: "10,000+", label: "Trees Planted" },
        ]}
        relatedCauses={[
          { title: "Lake Cleaning at Temple", link: "/causes/lake-cleaning" },
          { title: "Water Filter at School", link: "/causes/water-filter-school" },
        ]}
      />
      {/* Banana Leaf Request Form Section */}
      <BananaLeafRequestSection />
    </>
  );
};

export default EnvironmentalSafety;
