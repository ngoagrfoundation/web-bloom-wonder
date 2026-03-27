import { Link } from "react-router-dom";
import ProgramPageLayout from "@/components/ProgramPageLayout";
import foodImg from "@/assets/generated/programs/food-distribution.jpg";

const FoodDistribution = () => {
  return (
    <ProgramPageLayout
      title="Annadanam: Feeding the Needy"
      tagline="Serving Nourishment, Sharing Hope — No one should go to sleep hungry."
      heroImage={foodImg}
      overview="At AGR Foundation, we believe that no one should go to sleep hungry. As part of our commitment to Social Welfare, our volunteers work tirelessly to identify areas in and around Hyderabad where families and individuals are struggling for their next meal. Whether it is at a construction site, near a hospital, or in a remote pocket of the city, we go where the need is greatest."
      activities={[
        { title: "Need-Based Selection", description: "Our volunteers survey local areas to identify groups of people in genuine need of nutritional support." },
        { title: "Flexible Distribution", description: "We organize food drives on special occasions, weekly schedules, and monthly milestones, depending on the resources available." },
        { title: "Quality & Dignity", description: "We ensure the food served is fresh, hygienic, and nutritious, served with the respect every human being deserves." },
        { title: "Celebrate with a Smile", description: "Many supporters choose to sponsor a food drive to mark Birthdays, Anniversaries, or in Memory of Loved Ones. There is no greater way to celebrate a milestone." },
        { title: "Donate Meals (Food)", description: "If you wish to provide cooked food or dry rations (Rice, Dal, Oil), contact our volunteer coordinator to schedule a pickup or drop-off." },
        { title: "Community Outreach", description: "Know a place where people need food? Tell our volunteers — we make the community feel involved in the mission." },
      ]}
      stats={[
        { value: "1,000+", label: "Meals Served" },
        { value: "50+", label: "Food Drives" },
        { value: "20+", label: "Areas Covered" },
        { value: "100+", label: "Volunteers" },
      ]}
    >
      {/* Donation Tiers Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              How You Can Help
            </h2>
            <p className="text-muted-foreground mb-8">
              Your contribution, no matter the size, directly impacts someone's life today. 
              You can choose to donate cooked food or provide the funds for us to prepare a meal.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <div className="card-elevated p-6 text-center">
                <p className="text-3xl font-bold text-primary mb-2">₹500</p>
                <p className="text-muted-foreground text-sm">Feeds a small family for a day</p>
              </div>
              <div className="card-elevated p-6 text-center border-2 border-primary">
                <p className="text-3xl font-bold text-primary mb-2">₹2,500</p>
                <p className="text-muted-foreground text-sm">Sponsors a small community food drive</p>
              </div>
              <div className="card-elevated p-6 text-center">
                <p className="text-3xl font-bold text-primary mb-2">₹5,000+</p>
                <p className="text-muted-foreground text-sm">Sponsors a large-scale distribution event</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate" className="btn-primary">
                🧡 Donate for a Meal
              </Link>
              <a
                href="https://wa.me/917036555699?text=Hi%2C%20I%20would%20like%20to%20donate%20food%20or%20coordinate%20for%20Annadanam"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Contact Coordinator via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </ProgramPageLayout>
  );
};

export default FoodDistribution;
