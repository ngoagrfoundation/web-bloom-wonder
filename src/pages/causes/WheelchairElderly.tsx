import CausePageLayout from "@/components/CausePageLayout";

const WheelchairElderly = () => {
  return (
    <CausePageLayout
      title="Wheelchair for an Elderly Person"
      urgentMessage="Restore mobility and dignity to Thatha's life"
      heroImage="https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1200&h=600&fit=crop"
      story="Rajamma Thatha, 78, spent his entire life as a farmer, working hard to provide for his family. After a stroke two years ago, he lost the use of his legs and has been confined to his bed. His son, a daily wage laborer, cannot afford a wheelchair, and Thatha now depends entirely on family members for even basic movements like going outside for fresh air or visiting the temple he devotedly visited every day for 50 years."
      need="A wheelchair will transform Thatha's life, giving him back his independence and dignity. He will be able to move around his home, sit outside, and even visit the nearby temple with assistance. We aim to provide a sturdy, comfortable wheelchair suitable for an elderly person, along with accessories like a cushion for prolonged sitting and a blanket holder for the cooler months."
      goal={12000}
      raised={8500}
      donors={28}
      fundUsage={[
        { item: "Wheelchair Purchase", percentage: 75 },
        { item: "Comfort Accessories", percentage: 15 },
        { item: "Delivery & Setup", percentage: 10 },
      ]}
      galleryImages={[
        "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=400&h=300&fit=crop",
      ]}
      relatedFocus="Social Welfare"
      relatedFocusLink="/focus/social-welfare"
    />
  );
};

export default WheelchairElderly;
