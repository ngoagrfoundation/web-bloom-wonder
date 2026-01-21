import CausePageLayout from "@/components/CausePageLayout";

const WheelchairStudent = () => {
  return (
    <CausePageLayout
      title="Wheelchair for a Student"
      urgentMessage="Help Priya attend school independently"
      heroImage="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop"
      story="Priya is an 11-year-old girl who was born with a congenital condition affecting her lower limbs. Despite her mobility challenges, she is one of the brightest students in her class, consistently ranking at the top. Currently, her elderly grandmother carries her to school every day - a journey of 1 kilometer. As grandmother ages, this is becoming increasingly difficult, and Priya risks dropping out of school."
      need="Priya needs a quality wheelchair that is suited for both indoor use at school and the unpaved roads of her village. The wheelchair will give her independence, allowing her to attend school on her own and participate in activities with her peers. It will also relieve her aging grandmother from the daily physical strain. We are looking to provide a durable, comfortable wheelchair along with basic training for Priya to use it safely."
      fundUsage={[
        { item: "Wheelchair Purchase", percentage: 70 },
        { item: "Customization & Fitting", percentage: 15 },
        { item: "Accessories (Cushion, Bag)", percentage: 10 },
        { item: "Mobility Training", percentage: 5 },
      ]}
      galleryImages={[
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1631815588090-d4bfec5b1b98?w=400&h=300&fit=crop",
      ]}
      relatedFocus="Social Welfare"
      relatedFocusLink="/focus/social-welfare"
    />
  );
};

export default WheelchairStudent;
