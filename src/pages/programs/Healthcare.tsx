import ProgramPageLayout from "@/components/ProgramPageLayout";
import healthcareImage from "@/assets/healthcare-program.jpg";

const Healthcare = () => {
  return (
    <ProgramPageLayout
      title="Healthcare Initiatives"
      tagline="Organizing regular health camps, providing essential medical services, and ensuring healthcare reaches those who need it most in remote areas."
      heroImage={healthcareImage}
      overview="Good health is the cornerstone of a productive life. Our Healthcare Initiatives program is designed to bring quality medical care to communities that have limited access to healthcare facilities. Through regular health camps, mobile clinics, health awareness programs, and partnerships with hospitals, we ensure that essential medical services reach the most remote and underserved populations. We focus on preventive care, maternal and child health, and addressing common health issues that affect rural communities."
      activities={[
        {
          title: "Health Camps",
          description: "Regular medical camps with specialist doctors providing free check-ups, diagnosis, and basic treatments to rural communities.",
        },
        {
          title: "Mobile Health Units",
          description: "Mobile clinics that travel to remote villages, bringing healthcare directly to those who cannot access hospitals.",
        },
        {
          title: "Maternal & Child Health",
          description: "Pre-natal care, immunization drives, and nutrition programs for mothers and children under five.",
        },
        {
          title: "Health Awareness",
          description: "Educational programs on hygiene, nutrition, disease prevention, and healthy lifestyle choices.",
        },
        {
          title: "Medicine Distribution",
          description: "Providing essential medicines and first-aid supplies to families who cannot afford them.",
        },
        {
          title: "Hospital Referrals",
          description: "Connecting patients with partner hospitals for specialized treatments and surgeries at subsidized costs.",
        },
      ]}
      stats={[
        { value: "50,000+", label: "Patients Treated" },
        { value: "100+", label: "Health Camps" },
        { value: "30+", label: "Villages Covered" },
        { value: "20+", label: "Partner Hospitals" },
      ]}
      relatedFocus={[
        { title: "Social Welfare", link: "/focus/social-welfare" },
        { title: "Rural Development", link: "/focus/rural-development" },
        { title: "Women's Empowerment", link: "/focus/womens-empowerment" },
      ]}
    />
  );
};

export default Healthcare;
