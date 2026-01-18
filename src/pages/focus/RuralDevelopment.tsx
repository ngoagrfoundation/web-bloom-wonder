import FocusPageLayout from "@/components/FocusPageLayout";

const RuralDevelopment = () => {
  return (
    <FocusPageLayout
      title="Rural Development"
      tagline="Uplifting rural communities through infrastructure, services, and sustainable development programs."
      heroImage="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=600&fit=crop"
      overview="Our rural development initiatives aim to bridge the urban-rural divide by bringing essential services and infrastructure to underserved villages. We work on improving water access, sanitation, healthcare facilities, and education infrastructure, while also promoting sustainable agricultural practices and rural livelihoods."
      whyItMatters="Rural areas are home to a significant portion of our population, yet they often lack access to basic amenities and opportunities. By investing in rural development, we reduce migration pressure on cities, preserve agricultural communities, and ensure that progress reaches every corner of our nation."
      initiatives={[
        {
          title: "Clean Water Access",
          description: "Installing water purification systems, borewells, and pipeline networks to ensure safe drinking water in villages.",
        },
        {
          title: "Sanitation Facilities",
          description: "Building toilets and promoting hygiene practices to improve health outcomes and dignity in rural areas.",
        },
        {
          title: "Healthcare Camps",
          description: "Organizing regular health check-up camps with specialist doctors to bring medical care to remote villages.",
        },
        {
          title: "School Infrastructure",
          description: "Improving school buildings, providing furniture, and setting up computer labs in rural schools.",
        },
        {
          title: "Agricultural Support",
          description: "Training farmers in sustainable practices, organic farming, and connecting them to markets for better prices.",
        },
        {
          title: "Road & Connectivity",
          description: "Advocating for and supporting improved road connectivity and internet access in rural areas.",
        },
      ]}
      stats={[
        { value: "25+", label: "Villages Served" },
        { value: "5,000+", label: "Clean Water Access" },
        { value: "50+", label: "Healthcare Camps" },
        { value: "10+", label: "Schools Improved" },
      ]}
      relatedCauses={[
        { title: "Water Filter at School", link: "/causes/water-filter-school" },
        { title: "Lake Cleaning", link: "/causes/lake-cleaning" },
      ]}
    />
  );
};

export default RuralDevelopment;
