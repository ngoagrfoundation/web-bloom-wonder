import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import NewsCard, { NewsArticle } from "./NewsCard";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";

const latestNews: NewsArticle[] = [
  {
    id: "1",
    slug: "100-students-graduate-skill-program",
    title: "100 Students Graduate from Our Skill Development Program",
    excerpt: "A milestone celebration as our latest batch of students complete vocational training, ready to enter the workforce with confidence.",
    content: "",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800",
    author: "AGR Foundation",
    date: "2026-01-15",
    category: "success-story",
    readTime: 4,
  },
  {
    id: "2",
    slug: "new-healthcare-initiative-launch",
    title: "Launching Mobile Health Clinics in Rural Areas",
    excerpt: "Our new initiative brings essential healthcare services directly to underserved communities through mobile medical units.",
    content: "",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
    author: "Dr. Priya Sharma",
    date: "2026-01-10",
    category: "announcement",
    readTime: 3,
  },
  {
    id: "3",
    slug: "annual-fundraiser-gala-2026",
    title: "Annual Charity Gala Raises Record ₹50 Lakhs",
    excerpt: "Our community came together for an unforgettable evening of giving, breaking all previous fundraising records.",
    content: "",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    author: "AGR Foundation",
    date: "2026-01-05",
    category: "event",
    readTime: 5,
  },
];

const NewsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-14">
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">
            Latest Updates
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            News & Stories
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Stay updated with our latest initiatives, success stories, and community impact.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {latestNews.map((article) => (
            <StaggerItem key={article.id}>
              <NewsCard article={article} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection className="text-center">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
          >
            View All News
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default NewsSection;
