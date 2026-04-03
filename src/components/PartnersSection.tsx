import { useState, useEffect } from "react";
import { fetchPublicPartners } from "@/lib/api";

interface Partner {
  id: number;
  name: string;
  logo: string;
  website_url: string;
}

const PartnersSection = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicPartners()
      .then((data) => {
        if (data && data.length > 0) setPartners(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || partners.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">Collaborations</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">Our Partners</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Organizations that share our vision and collaborate with us for greater impact.</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <a
              key={partner.id}
              href={partner.website_url || "#"}
              target={partner.website_url ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 md:h-16 w-auto object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="h-12 md:h-16 px-6 flex items-center justify-center rounded-lg bg-muted text-muted-foreground text-sm font-medium">
                  {partner.name}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
