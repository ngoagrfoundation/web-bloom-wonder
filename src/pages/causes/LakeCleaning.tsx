import CausePageLayout from "@/components/CausePageLayout";

const LakeCleaning = () => {
  return (
    <CausePageLayout
      title="Cleaning the Lake at Temple"
      urgentMessage="Help us restore this sacred water body for the community"
      heroImage="https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=1200&h=600&fit=crop"
      story="The ancient temple lake in our village has been a sacred site for generations, serving as a place for religious ceremonies, community gatherings, and providing water for the surrounding areas. However, years of neglect and pollution have degraded this precious water body. Accumulated waste, silt, and invasive plants have severely impacted the lake's ecosystem and its ability to serve the community."
      need="We need to undertake a comprehensive restoration project that includes removing accumulated waste and debris, desilting the lake bed, installing proper drainage systems, and planting native aquatic plants to restore the ecosystem. The project will also include building proper pathways and installing waste bins to prevent future pollution. This restoration will benefit over 2,000 families who depend on this water body for various purposes."
      fundUsage={[
        { item: "Waste Removal & Cleaning", percentage: 40 },
        { item: "Desilting & Restoration", percentage: 30 },
        { item: "Infrastructure (Pathways, Bins)", percentage: 20 },
        { item: "Maintenance & Supervision", percentage: 10 },
      ]}
      galleryImages={[
        "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
      ]}
      relatedFocus="Environmental Safety"
      relatedFocusLink="/focus/environmental-safety"
    />
  );
};

export default LakeCleaning;
