import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import NewsCard, { NewsArticle } from "./NewsCard";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";
import { fetchPublicNews } from "@/lib/api";
import graduationImg from "@/assets/generated/education/graduation.jpg";
import mobileClinc from "@/assets/generated/healthcare/mobile-clinic.jpg";
import fundraiserGala from "@/assets/generated/events/fundraiser-gala.jpg";

const staticNews: NewsArticle[] = [
  {
    id: "1", slug: "100-students-graduate-skill-program",
    title: "100 Students Graduate from Our Skill Development Program",
    excerpt: "A milestone celebration as our latest batch of students complete vocational training, ready to enter the workforce with confidence.",
    content: "", image: graduationImg, author: "AGR Foundation", date: "2026-01-15", category: "success-story", readTime: 4,
  },
  {
    id: "2", slug: "new-healthcare-initiative-launch",
    title: "Launching Mobile Health Clinics in Rural Areas",
    excerpt: "Our new initiative brings essential healthcare services directly to underserved communities through mobile medical units.",
    content: "", image: mobileClinc, author: "Dr. Priya Sharma", date: "2026-01-10", category: "announcement", readTime: 3,
  },
  {
    id: "3", slug: "annual-fundraiser-gala-2026",
    title: "Annual Charity Gala Raises Record ₹50 Lakhs",
    excerpt: "Our community came together for an unforgettable evening of giving, breaking all previous fundraising records.",
    content: "", image: fundraiserGala, author: "AGR Foundation", date: "2026-01-05", category: "event", readTime: 5,
  },
];

const NewsSection = () => {
  const [news, setNews] = useState<NewsArticle[]>(staticNews);

  useEffect(() => {
    fetchPublicNews(3).then((data) => {
      if (data && data.length > 0) {
        const mapped: NewsArticle[] = data.map((a: Record<string, unknown>) => ({
          id: String(a.id || ''),
          slug: String(a.slug || ''),
          title: String(a.title || ''),
          excerpt: String(a.excerpt || ''),
          content: String(a.content || ''),
          image: String(a.image || ''),
          author: String(a.author || 'AGR Foundation'),
          date: String(a.published_at || a.created_at || ''),
          category: (a.category as NewsArticle['category']) || 'announcement',
          readTime: Number(a.read_time || 3),
        }));
        setNews(mapped);
      }
    });
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-14">
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">Latest Updates</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">News & Stories</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Stay updated with our latest initiatives, success stories, and community impact.</p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {news.map((article) => (
            <StaggerItem key={article.id}>
              <NewsCard article={article} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection className="text-center">
          <Link to="/news" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group">
            View All News
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default NewsSection;
