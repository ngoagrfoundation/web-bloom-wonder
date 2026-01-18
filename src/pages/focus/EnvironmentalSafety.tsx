import FocusPageLayout from "@/components/FocusPageLayout";

const EnvironmentalSafety = () => {
  return (
    <FocusPageLayout
      title="Environmental Safety"
      tagline="Protecting and preserving our environment for future generations through sustainable practices and community action."
      heroImage="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop"
      overview="Environmental protection is at the heart of sustainable development. Our environmental safety programs focus on preserving natural resources, promoting clean practices, and educating communities about the importance of environmental conservation. We work on water body restoration, waste management, tree plantation, and creating awareness about climate change and its impacts."
      whyItMatters="A healthy environment is essential for human well-being and sustainable development. Clean water, fresh air, and preserved ecosystems directly impact health, livelihoods, and quality of life. By protecting our environment today, we ensure that future generations inherit a planet that can sustain and nurture them."
      initiatives={[
        {
          title: "Lake & Water Body Restoration",
          description: "Cleaning and revitalizing temple tanks, ponds, and lakes to restore aquatic ecosystems and ensure clean water access.",
        },
        {
          title: "Tree Plantation Drives",
          description: "Organizing large-scale tree plantation events to increase green cover and combat climate change effects.",
        },
        {
          title: "Waste Management",
          description: "Implementing waste segregation and recycling programs in communities to reduce pollution and promote cleanliness.",
        },
        {
          title: "Clean Energy Awareness",
          description: "Promoting solar energy and energy-efficient practices among rural households and institutions.",
        },
        {
          title: "Plastic-Free Campaigns",
          description: "Driving awareness about plastic pollution and supporting alternatives to single-use plastics.",
        },
        {
          title: "Environmental Education",
          description: "Conducting workshops in schools and communities about environmental conservation and sustainable living.",
        },
      ]}
      stats={[
        { value: "5+", label: "Lakes Restored" },
        { value: "10,000+", label: "Trees Planted" },
        { value: "20+", label: "Clean-up Drives" },
        { value: "3,000+", label: "People Educated" },
      ]}
      relatedCauses={[
        { title: "Lake Cleaning at Temple", link: "/causes/lake-cleaning" },
        { title: "Water Filter at School", link: "/causes/water-filter-school" },
      ]}
    />
  );
};

export default EnvironmentalSafety;
