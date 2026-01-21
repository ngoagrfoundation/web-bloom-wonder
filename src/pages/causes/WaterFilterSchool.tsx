import CausePageLayout from "@/components/CausePageLayout";

const WaterFilterSchool = () => {
  return (
    <CausePageLayout
      title="Water Filter at a School"
      urgentMessage="Provide clean drinking water for 500+ students"
      heroImage="https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=1200&h=600&fit=crop"
      story="The Government Primary School in Rampur village serves over 500 students from surrounding areas. Currently, the school relies on groundwater that has been found to contain harmful contaminants including excess fluoride and iron. Many students have reported health issues, and parents are concerned about the long-term effects of consuming this water. Despite multiple requests, the school lacks funds to install a proper water purification system."
      need="We aim to install a high-capacity RO water purification system that can provide safe, clean drinking water to all 500+ students and staff. The system will include multiple dispensing points, proper maintenance arrangements, and training for school staff on upkeep. This single installation will protect children's health and serve the school for years to come, ensuring that no child has to compromise their health due to lack of clean water."
      fundUsage={[
        { item: "RO System Purchase & Installation", percentage: 60 },
        { item: "Plumbing & Infrastructure", percentage: 20 },
        { item: "Annual Maintenance Contract", percentage: 15 },
        { item: "Staff Training", percentage: 5 },
      ]}
      galleryImages={[
        "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1564429238980-16e22e61007b?w=400&h=300&fit=crop",
      ]}
      relatedFocus="Rural Development"
      relatedFocusLink="/focus/rural-development"
    />
  );
};

export default WaterFilterSchool;
