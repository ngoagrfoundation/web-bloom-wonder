import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "AGR Foundation's support has completely transformed my life. I was able to complete my education and now I'm pursuing my dreams of becoming a teacher.",
    name: "Maria Lopez",
    role: "Education Program Beneficiary",
  },
  {
    quote:
      "The healthcare camp organized by AGR Foundation saved my father's life. We are forever grateful for their timely intervention and care.",
    name: "Ramesh Kumar",
    role: "Healthcare Initiative Recipient",
  },
  {
    quote:
      "Thanks to the skill development program, I now run my own small business. AGR Foundation gave me the confidence and tools to become independent.",
    name: "Sunita Devi",
    role: "Livelihood Program Member",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 section-warm">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Voices of Change
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Hear from the people whose lives have been touched by our programs.
          </p>
        </div>

        {/* Testimonial */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            {/* Quote */}
            <blockquote className="font-display text-xl md:text-2xl text-foreground italic mb-8 leading-relaxed">
              "{testimonials[currentIndex].quote}"
            </blockquote>
            
            {/* Author */}
            <div className="mb-10">
              <p className="font-semibold text-foreground text-lg">
                {testimonials[currentIndex].name}
              </p>
              <p className="text-muted-foreground text-sm">
                {testimonials[currentIndex].role}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-6">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? "bg-primary w-6" 
                        : "bg-border hover:bg-muted-foreground"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
