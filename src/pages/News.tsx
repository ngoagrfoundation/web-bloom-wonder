import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { MobileLayout } from "@/components/mobile";
import NewsCard, { NewsArticle } from "@/components/NewsCard";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { newsletterSchema } from "@/lib/validation";
import { useFormSecurity } from "@/hooks/useFormSecurity";
import { toast } from "sonner";
import { fetchPublicNews } from "@/lib/api";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { honeypotProps, validateSubmission, recordSubmission, isCooldown, cooldownRemaining } =
    useFormSecurity({ minSubmitTimeSeconds: 2, cooldownMs: 60000 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSubmission()) { toast.error("Please wait before subscribing again"); return; }
    const result = newsletterSchema.safeParse({ email });
    if (!result.success) { toast.error(result.error.errors[0].message); return; }
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      recordSubmission();
      toast.success("Thank you for subscribing!");
      setEmail("");
    } catch { toast.error("Failed to subscribe. Please try again."); }
    finally { setIsSubmitting(false); }
  };

  return (
    <section className="py-16 bg-secondary/10">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">Stay Informed</h2>
          <p className="text-muted-foreground mb-8">Subscribe to our newsletter and never miss an update on our initiatives and impact.</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input {...honeypotProps} />
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required className="flex-1 px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none transition-colors" />
            <button type="submit" disabled={isSubmitting || isCooldown} className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Subscribing..." : isCooldown ? `Wait ${cooldownRemaining}s` : "Subscribe"}
            </button>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
};

const categories = [
  { id: "all", label: "All" },
  { id: "success-story", label: "Success Stories" },
  { id: "announcement", label: "Announcements" },
  { id: "event", label: "Events" },
  { id: "community", label: "Community" },
];

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicNews()
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
          setAllNews(mapped);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredNews = allNews.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredNews[0];
  const otherArticles = filteredNews.slice(1);

  return (
    <MobileLayout>
      <main className="pt-14 md:pt-20">
        <section className="py-16 relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection className="text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">News & Stories</h1>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">Stay updated with our latest initiatives, success stories, and the impact we're creating together.</p>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative max-w-md w-full">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map((category) => (
                  <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />)}
              </div>
            </div>
          </section>
        ) : allNews.length === 0 ? (
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <p className="text-muted-foreground text-lg">No articles published yet. Check back soon!</p>
            </div>
          </section>
        ) : (
          <>
            {featuredArticle && (
              <section className="py-12">
                <div className="container mx-auto px-4"><AnimatedSection><NewsCard article={featuredArticle} featured /></AnimatedSection></div>
              </section>
            )}

            <section className="py-12 section-cream">
              <div className="container mx-auto px-4">
                {otherArticles.length > 0 ? (
                  <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherArticles.map((article) => (<StaggerItem key={article.id}><NewsCard article={article} /></StaggerItem>))}
                  </StaggerContainer>
                ) : (
                  <div className="text-center py-12"><p className="text-muted-foreground text-lg">No articles found matching your search.</p></div>
                )}
              </div>
            </section>
          </>
        )}

        <NewsletterSection />
      </main>
    </MobileLayout>
  );
};

export default News;
