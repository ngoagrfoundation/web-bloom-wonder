import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import NewsCard, { NewsArticle } from "./NewsCard";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";
import { fetchPublicNews } from "@/lib/api";

const NewsSection = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicNews(3)
      .then((data) => {
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
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (news.length === 0) return null;

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
