import FocusPageLayout from "@/components/FocusPageLayout";

const SkillDevelopment = () => {
  return (
    <FocusPageLayout
      title="Skill Development"
      tagline="Building capabilities for sustainable livelihoods through vocational training and modern skill programs."
      heroImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop"
      overview="Our skill development programs are designed to equip youth and adults with practical skills that lead to employment and entrepreneurship opportunities. We focus on both traditional crafts and modern technology skills, ensuring our beneficiaries are prepared for the evolving job market while preserving valuable cultural heritage."
      whyItMatters="In today's rapidly changing economy, having marketable skills is crucial for securing livelihoods. Skill development not only provides income opportunities but also builds confidence, dignity, and self-reliance. By training individuals, we help break the cycle of poverty and create pathways to prosperity."
      initiatives={[
        {
          title: "Computer Training",
          description: "Basic to advanced computer skills including MS Office, internet usage, and digital literacy for the modern workplace.",
        },
        {
          title: "Tailoring & Fashion Design",
          description: "Comprehensive training in garment making, fashion design, and entrepreneurship for starting clothing businesses.",
        },
        {
          title: "Handicrafts & Artisan Skills",
          description: "Preserving traditional crafts while creating economic opportunities through training in pottery, weaving, and more.",
        },
        {
          title: "Mobile Phone Repair",
          description: "Technical training in smartphone repair and maintenance, a high-demand skill in today's digital age.",
        },
        {
          title: "Beauty & Wellness",
          description: "Professional beauty, haircare, and wellness training for careers in the growing personal care industry.",
        },
        {
          title: "Entrepreneurship Support",
          description: "Business planning, marketing, and financial management training to help skilled individuals start their own ventures.",
        },
      ]}
      stats={[
        { value: "1,000+", label: "Youth Trained" },
        { value: "15+", label: "Skill Programs" },
        { value: "75%", label: "Employment Rate" },
        { value: "100+", label: "Businesses Started" },
      ]}
      relatedCauses={[
        { title: "Women's Empowerment", link: "/focus/womens-empowerment" },
        { title: "Treatment Support for Students", link: "/causes/physically-challenged-treatment" },
      ]}
    />
  );
};

export default SkillDevelopment;
