import { useState, useEffect } from "react";
import { fetchPublicSponsors } from "@/lib/api";

interface Sponsor {
  id: number;
  name: string;
  logo: string;
  website_url: string;
}

const SponsorsSection = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicSponsors()
      .then((data) => {
        if (data && data.length > 0) setSponsors(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || sponsors.length === 0) return null;

  return (
    <section className="py-20 section-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">Gratitude</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">Our Supporters</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Generous individuals and organizations funding our mission.</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.website_url || "#"}
              target={sponsor.website_url ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group"
            >
              {sponsor.logo ? (
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-12 md:h-16 w-auto object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="h-12 md:h-16 px-6 flex items-center justify-center rounded-lg bg-muted text-muted-foreground text-sm font-medium">
                  {sponsor.name}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
