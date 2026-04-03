import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchPublicTestimonials } from "@/lib/api";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  photo?: string;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    fetchPublicTestimonials()
      .then((data) => {
        if (data && data.length > 0) setTestimonials(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (testimonials.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [testimonials.length]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
  };

  if (loading) return null;
  if (testimonials.length === 0) return null;

  const nextTestimonial = () => { setCurrentIndex((prev) => (prev + 1) % testimonials.length); resetTimer(); };
  const prevTestimonial = () => { setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length); resetTimer(); };

  return (
    <section className="py-24 section-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 mt-2">Voices of Change</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Hear from the people whose lives have been touched by our programs.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            {testimonials[currentIndex]?.photo && (
              <div className="mb-6">
                <img src={testimonials[currentIndex].photo} alt={testimonials[currentIndex].name} className="w-16 h-16 rounded-full object-cover mx-auto" loading="lazy" />
              </div>
            )}
            <blockquote className="font-display text-xl md:text-2xl text-foreground italic mb-8 leading-relaxed">
              "{testimonials[currentIndex]?.quote}"
            </blockquote>
            <div className="mb-10">
              <p className="font-semibold text-foreground text-lg">{testimonials[currentIndex]?.name}</p>
              <p className="text-muted-foreground text-sm">{testimonials[currentIndex]?.role}</p>
            </div>

            <div className="flex justify-center items-center gap-6">
              <button onClick={prevTestimonial} className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Previous testimonial">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button key={index} onClick={() => { setCurrentIndex(index); resetTimer(); }} className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"}`} aria-label={`Go to testimonial ${index + 1}`} />
                ))}
              </div>
              <button onClick={nextTestimonial} className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Next testimonial">
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
