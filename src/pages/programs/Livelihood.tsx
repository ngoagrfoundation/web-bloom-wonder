import ProgramPageLayout from "@/components/ProgramPageLayout";
import livelihoodImage from "@/assets/livelihood-program.jpg";

const Livelihood = () => {
  return (
    <ProgramPageLayout
      title="Livelihood Support"
      tagline="Empowering women and youth through skill development, vocational training, and self-help groups for sustainable income generation."
      heroImage={livelihoodImage}
      overview="Economic independence is key to breaking the cycle of poverty. Our Livelihood Support program focuses on equipping individuals, especially women and youth, with marketable skills that enable them to earn a sustainable income. Through vocational training, self-help group formation, microfinance support, and entrepreneurship development, we help community members become self-reliant and contribute to their family's economic well-being. We believe that when one person in a family becomes economically empowered, it creates a ripple effect that benefits the entire community."
      activities={[
        {
          title: "Vocational Training",
          description: "Hands-on training in tailoring, handicrafts, beauty services, mobile repair, and other marketable skills.",
        },
        {
          title: "Self-Help Groups",
          description: "Forming and supporting women's self-help groups for collective savings, microloans, and mutual support.",
        },
        {
          title: "Entrepreneurship Support",
          description: "Business training, mentorship, and seed funding to help individuals start their own micro-enterprises.",
        },
        {
          title: "Market Linkages",
          description: "Connecting artisans and producers with markets to sell their products at fair prices.",
        },
        {
          title: "Financial Literacy",
          description: "Training on savings, budgeting, banking, and managing household finances effectively.",
        },
        {
          title: "Job Placement",
          description: "Connecting trained individuals with employment opportunities through our network of partner organizations.",
        },
      ]}
      stats={[
        { value: "2,000+", label: "Trained Individuals" },
        { value: "50+", label: "Self-Help Groups" },
        { value: "75%", label: "Employment Rate" },
        { value: "200+", label: "Businesses Started" },
      ]}
      relatedFocus={[
        { title: "Skill Development", link: "/focus/skill-development" },
        { title: "Women's Empowerment", link: "/focus/womens-empowerment" },
        { title: "Rural Development", link: "/focus/rural-development" },
      ]}
    />
  );
};

export default Livelihood;
