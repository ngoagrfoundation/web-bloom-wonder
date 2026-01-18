import { useEffect, useState, useRef } from "react";

const stats = [
  { value: 1500, suffix: "+", label: "Beneficiaries Reached" },
  { value: 30, suffix: "+", label: "Programs Running" },
  { value: 150, suffix: "+", label: "Volunteers Active" },
  { value: 8, suffix: "", label: "Districts Covered" },
];

const AnimatedCounter = ({
  value,
  suffix,
  duration = 2000,
  isVisible,
}: {
  value: number;
  suffix: string;
  duration?: number;
  isVisible: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, isVisible]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const ImpactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="impact" className="py-24 bg-background" ref={sectionRef}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Since our inception, we have been working tirelessly to make a difference 
            in the lives of thousands of people across India.
          </p>
        </div>

        {/* Stats Grid - Cleaner with subtle dividers */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-border">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center px-4"
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isVisible={isVisible}
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
