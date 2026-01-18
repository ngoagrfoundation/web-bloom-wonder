import FocusPageLayout from "@/components/FocusPageLayout";

const WomensEmpowerment = () => {
  return (
    <FocusPageLayout
      title="Women's Empowerment"
      tagline="Empowering women through education, skill training, and financial independence to build stronger communities."
      heroImage="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=600&fit=crop"
      overview="At AGR Foundation, we believe that empowering women is the key to transforming communities. Our women's empowerment programs focus on providing education, vocational training, and economic opportunities to women from underprivileged backgrounds. We work to break down barriers and create pathways for women to achieve financial independence and become leaders in their communities."
      whyItMatters="When women are empowered, entire communities thrive. Studies show that women reinvest up to 90% of their income back into their families, leading to better education, health, and nutrition for children. By investing in women, we create a ripple effect that benefits generations to come and builds stronger, more resilient communities."
      initiatives={[
        {
          title: "Self-Help Groups",
          description: "Formation and support of women's self-help groups for collective savings, micro-credit, and community development activities.",
        },
        {
          title: "Vocational Training",
          description: "Skill development programs in tailoring, handicrafts, food processing, and computer literacy for economic independence.",
        },
        {
          title: "Health Awareness",
          description: "Workshops on maternal health, nutrition, and hygiene to ensure women and their families lead healthier lives.",
        },
        {
          title: "Financial Literacy",
          description: "Training programs on savings, budgeting, and basic accounting to help women manage their finances effectively.",
        },
        {
          title: "Leadership Development",
          description: "Building confidence and leadership skills to enable women to take active roles in community decision-making.",
        },
        {
          title: "Legal Awareness",
          description: "Educating women about their legal rights and providing support for accessing justice and government schemes.",
        },
      ]}
      stats={[
        { value: "500+", label: "Women Trained" },
        { value: "50+", label: "Self-Help Groups" },
        { value: "200+", label: "Businesses Started" },
        { value: "15+", label: "Villages Reached" },
      ]}
      relatedCauses={[
        { title: "Skill Development Programs", link: "/focus/skill-development" },
        { title: "Treatment Support", link: "/causes/physically-challenged-treatment" },
      ]}
    />
  );
};

export default WomensEmpowerment;
