import FocusPageLayout from "@/components/FocusPageLayout";

const SocialWelfare = () => {
  return (
    <FocusPageLayout
      title="Social Welfare"
      tagline="Supporting the most vulnerable in our society with compassion, dignity, and practical assistance."
      heroImage="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=600&fit=crop"
      overview="Our social welfare programs are designed to provide support to those who need it most - the elderly, persons with disabilities, orphans, and families in crisis. We believe that every individual deserves to live with dignity, and our programs aim to provide essential support while promoting inclusion and social integration."
      whyItMatters="A compassionate society is measured by how it treats its most vulnerable members. Many elderly individuals, persons with disabilities, and orphaned children lack family support or access to resources. By stepping in to provide care and assistance, we uphold human dignity and build a more inclusive society."
      initiatives={[
        {
          title: "Elderly Care",
          description: "Support services for senior citizens including health check-ups, mobility aids, and social engagement programs.",
        },
        {
          title: "Disability Support",
          description: "Providing wheelchairs, prosthetics, and assistive devices along with rehabilitation support for persons with disabilities.",
        },
        {
          title: "Orphan Support",
          description: "Educational sponsorship and essential supplies for orphaned children to ensure they have opportunities for a better future.",
        },
        {
          title: "Food Distribution",
          description: "Regular distribution of groceries and cooked meals to families in crisis and during natural disasters.",
        },
        {
          title: "Emergency Relief",
          description: "Rapid response assistance during floods, fires, and other emergencies affecting vulnerable communities.",
        },
        {
          title: "Medical Assistance",
          description: "Financial support for critical medical treatments and surgeries for those who cannot afford healthcare.",
        },
      ]}
      stats={[
        { value: "200+", label: "Elderly Supported" },
        { value: "150+", label: "Wheelchairs Given" },
        { value: "100+", label: "Orphans Sponsored" },
        { value: "1,000+", label: "Families Helped" },
      ]}
      relatedCauses={[
        { title: "Wheelchair for Student", link: "/causes/wheelchair-student" },
        { title: "Wheelchair for Elderly", link: "/causes/wheelchair-elderly" },
        { title: "Treatment Support", link: "/causes/physically-challenged-treatment" },
      ]}
    />
  );
};

export default SocialWelfare;
