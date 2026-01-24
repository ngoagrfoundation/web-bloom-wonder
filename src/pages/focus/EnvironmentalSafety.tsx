import FocusPageLayout from "@/components/FocusPageLayout";

const EnvironmentalSafety = () => {
  return (
    <FocusPageLayout
      title="Environmental Safety"
      tagline="Building a self-sustainable and eco-friendly society through traditional wisdom and modern innovation."
      heroImage="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop"
      overview="At AGR Foundation, we believe true development means living in harmony with nature. Our environmental safety programs promote biodegradable alternatives to plastic, train communities in eco-friendly packaging, and educate about sustainable living. From plastic-free community drives to training women in sustainable practices, we're creating a movement towards a greener future."
      whyItMatters="Every plastic bag takes 500 years to decompose. By choosing eco-friendly alternatives, we protect our water bodies, soil, and the health of future generations. Our initiatives not only preserve the environment but also create livelihoods and strengthen community bonds through shared sustainable practices."
      initiatives={[
        {
          title: "Sustainable Alternatives Program",
          description: "Promoting biodegradable and eco-friendly alternatives to plastic for community gatherings, festivals, and daily use.",
        },
        {
          title: "Eco-Friendly Packaging Training",
          description: "Training women and youth in creating biodegradable packaging solutions using natural materials like palm leaves and cloth wraps.",
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
          description: "Organizing native tree plantation drives to increase green cover and combat climate change in rural areas.",
        },
        {
          title: "Zero Waste Workshops",
          description: "Conducting workshops in schools and communities about waste segregation, composting, and adopting zero-waste lifestyles.",
        },
      ]}
      stats={[
        { value: "200+", label: "Women Trained" },
        { value: "25+", label: "Plastic-Free Events" },
        { value: "10,000+", label: "Trees Planted" },
        { value: "15+", label: "Lakes Restored" },
      ]}
      relatedCauses={[
        { title: "Lake Cleaning at Temple", link: "/causes/lake-cleaning" },
        { title: "Water Filter at School", link: "/causes/water-filter-school" },
      ]}
    />
  );
};

export default EnvironmentalSafety;
