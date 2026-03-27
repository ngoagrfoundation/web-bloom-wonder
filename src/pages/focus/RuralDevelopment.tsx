import FocusPageLayout from "@/components/FocusPageLayout";
import ruralDevImg from "@/assets/generated/focus/rural-development.jpg";

const RuralDevelopment = () => {
  return (
    <FocusPageLayout
      title="Rural Development"
      tagline="Building Self-Sustained Villages — Empowering the Heart of India through Eco-Friendly Progress."
      heroImage={ruralDevImg}
      overview="At AGR Foundation, our vision for rural development goes beyond basic aid. We are working to create 'Model Villages' where traditional wisdom meets modern sustainability. By focusing on organic farming, clean energy, and local entrepreneurship, we ensure that our rural communities are not just surviving, but thriving."
      whyItMatters="We don't want people to leave villages for cities; we want to bring the opportunities of the city to the village — without the pollution. Better Health through chemical-free food and clean water. Better Wealth through skill-based entrepreneurship and technology. Better Future for the next generation to grow up in a clean, prosperous environment. When our villages are self-sufficient, India becomes self-sufficient."
      initiatives={[
        { title: "Natural & Commercial Crop Training", description: "Educating farmers on high-value, natural crops like Sprouted Garlic and medicinal herbs to increase their income sustainably." },
        { title: "Apiculture (Honey Bee Farming)", description: "Integrating beekeeping into traditional farms, providing extra revenue through pure honey sales and improving crop yields through natural pollination." },
        { title: "Drone-Aided Organic Farming", description: "Introducing Drone Technology to spray organic fertilizers (Jeevamrutham) across large areas, protecting farmers from physical labor and keeping honey bees safe from toxic pesticides." },
        { title: "Community Markets", description: "Organizing stalls in gated communities and urban centers for organic farmers and artisans to sell their produce directly at fair prices." },
        { title: "Millet Empowerment Hubs", description: "Setting up local units where village women produce healthy, unadulterated Jonna Rottelu (Sorghum bread), providing full-time employment while improving urban health." },
        { title: "Waste-to-Wealth", description: "Developing systems where agricultural waste and cow dung are converted into eco-friendly products like Agarbattis and organic manure." },
        { title: "Pond & Water Restoration", description: "Cleaning local water bodies and installing innovative, eco-friendly features like bicycle-powered water fountains to aerate ponds while promoting community fitness." },
        { title: "Plastic-Free Villages", description: "Implementing pilot projects in local markets to replace plastic bags with biodegradable alternatives, ensuring our soil and water remain pure for the next generation." },
        { title: "Spiritual & Social Hubs", description: "Supporting the maintenance of local temples and organizing Satsangs and Bhagavad Gita Parayanams to strengthen the social and spiritual fabric of the village." },
      ]}
      stats={[
        { value: "100+", label: "Farmers Trained" },
        { value: "20+", label: "Women Empowered" },
        { value: "5,000+", label: "Plastic Bags Replaced" },
        { value: "10+", label: "Villages Served" },
      ]}
      relatedCauses={[
        { title: "Water Filter at School", link: "/causes/water-filter-school" },
        { title: "Lake Cleaning", link: "/causes/lake-cleaning" },
      ]}
    />
  );
};

export default RuralDevelopment;
