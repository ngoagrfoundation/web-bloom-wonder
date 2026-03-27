import ProgramPageLayout from "@/components/ProgramPageLayout";
import sanskritImg from "@/assets/generated/programs/learning-sanskrit.jpg";

const LearningSanskrit = () => {
  return (
    <ProgramPageLayout
      title="Learning Sanskrit"
      tagline="Rediscover Your Roots: Free Sanskrit Classes — Unlock the Wisdom of the Vedas & Transform Your Life."
      heroImage={sanskritImg}
      overview="Sanskrit is more than just a language; it is a 'Vibration Science.' While the world's leading universities are researching its profound depths, AGR Foundation is bringing this sacred tongue back into your daily life. Our mission is to see Sanskrit spoken in every household and reinstated as a core subject in schools."
      activities={[
        { title: "For the Mind", description: "Learning Sanskrit is a 'brain tonic.' It is scientifically proven to improve memory, focus, and cognitive function, leading to a calm and peaceful state of mind (Prashantata)." },
        { title: "For Children", description: "Sanskrit acts as a foundation for all languages. It refines the tongue, making it easier for children to pronounce complex words in any language with perfect clarity." },
        { title: "For Couples", description: "When both husband and wife learn together, it fosters a shared spiritual bond and brings a higher level of understanding and harmony into the home." },
        { title: "Access Ancient Wisdom", description: "Understand the Vedas and Shastras exactly as they were written, connecting directly with the information left by our ancestors." },
        { title: "Perfect Articulation for Kids", description: "Sanskrit is a phonetic language. Practicing its unique sounds acts as 'speech therapy,' helping children pronounce words in any language with clarity and confidence." },
        { title: "Character Building", description: "Beyond the grammar, children learn the values of our ancestors, helping them grow into responsible, respectful, and culturally rooted individuals." },
      ]}
      stats={[
        { value: "21", label: "Days to Fluency" },
        { value: "100%", label: "Free Course" },
        { value: "3", label: "Batch Timings" },
        { value: "No", label: "Age Limit" },
      ]}
    >
      {/* Course Details Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6 text-center">
              Course Details: Speak Sanskrit in Just 21 Days!
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              We offer interactive Online Zoom Classes designed to get you speaking fluently in just three weeks.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="card-elevated p-6">
                <p className="text-primary font-bold">Eligibility</p>
                <p className="text-muted-foreground mt-1">No Age Limit — From kids to seniors, everyone is welcome!</p>
              </div>
              <div className="card-elevated p-6">
                <p className="text-primary font-bold">Fee</p>
                <p className="text-muted-foreground mt-1">Completely FREE</p>
              </div>
              <div className="card-elevated p-6">
                <p className="text-primary font-bold">Platform</p>
                <p className="text-muted-foreground mt-1">Live via Zoom</p>
              </div>
              <div className="card-elevated p-6">
                <p className="text-primary font-bold">Flexible Batch Timings</p>
                <ul className="text-muted-foreground mt-1 space-y-1 text-sm">
                  <li>• Early Morning: 5:00 AM – 6:30 AM</li>
                  <li>• Afternoon: 1:00 PM – 2:30 PM</li>
                  <li>• Late Evening: 8:00 PM – 9:30 PM</li>
                </ul>
              </div>
            </div>

            {/* Bhagavad Gita Section */}
            <div className="bg-muted/50 rounded-xl p-8 mb-8 text-center">
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                🙏 Invite the Divine: Bhagavad Gita Parayanam
              </h3>
              <p className="text-muted-foreground mb-4">
                Does your home or workplace feel heavy? The sacred vibrations of the Gita are known to 
                eliminate negative energy and bring a sense of divine protection. Whether it is a wedding, 
                a housewarming, or any family gathering, our foundation members are available to perform 
                Bhagavad Gita Parayanam. Invite us to fill your space with positive energy and ancient wisdom.
              </p>
            </div>

            {/* Registration CTA */}
            <div className="text-center">
              <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                Join the Movement – Register Now
              </h3>
              <p className="text-muted-foreground mb-6">
                Start your journey toward a calmer mind and a more vibrant life.
              </p>
              <a
                href="https://wa.me/917036555699?text=Hi%2C%20I%20would%20like%20to%20register%20for%20Free%20Sanskrit%20Classes"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Click Here to Register via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </ProgramPageLayout>
  );
};

export default LearningSanskrit;
