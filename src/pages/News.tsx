import { useState } from "react";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard, { NewsArticle } from "@/components/NewsCard";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { newsletterSchema } from "@/lib/validation";
import { useFormSecurity } from "@/hooks/useFormSecurity";
import { toast } from "sonner";

// Newsletter Section Component with validation
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { honeypotProps, validateSubmission, recordSubmission, isCooldown, cooldownRemaining } =
    useFormSecurity({ minSubmitTimeSeconds: 2, cooldownMs: 60000 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSubmission()) {
      toast.error("Please wait before subscribing again");
      return;
    }

    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      recordSubmission();
      toast.success("Thank you for subscribing!");
      setEmail("");
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-secondary/10">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Stay Informed
          </h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter and never miss an update on our initiatives and impact.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input {...honeypotProps} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              required
              className="flex-1 px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting || isCooldown}
              className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Subscribing..."
                : isCooldown
                ? `Wait ${cooldownRemaining}s`
                : "Subscribe"}
            </button>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
};

const allNews: NewsArticle[] = [
  {
    id: "1",
    slug: "100-students-graduate-skill-program",
    title: "100 Students Graduate from Our Skill Development Program",
    excerpt: "A milestone celebration as our latest batch of students complete vocational training, ready to enter the workforce with confidence.",
    content: "Full article content here...",
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
    content: "Full article content here...",
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
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    author: "AGR Foundation",
    date: "2026-01-05",
    category: "event",
    readTime: 5,
  },
  {
    id: "4",
    slug: "community-kitchen-feeds-500-daily",
    title: "Community Kitchen Now Feeds 500 People Daily",
    excerpt: "Thanks to generous donors, our community kitchen has expanded operations to serve more nutritious meals every day.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
    author: "Vikram Patel",
    date: "2025-12-28",
    category: "community",
    readTime: 4,
  },
  {
    id: "5",
    slug: "new-education-center-opens",
    title: "New Education Center Opens in Dharavi",
    excerpt: "A state-of-the-art learning facility now provides quality education to over 200 children from underserved families.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
    author: "AGR Foundation",
    date: "2025-12-20",
    category: "announcement",
    readTime: 6,
  },
  {
    id: "6",
    slug: "volunteer-spotlight-meera-gupta",
    title: "Volunteer Spotlight: Meera Gupta's Inspiring Journey",
    excerpt: "Meet Meera, who has dedicated over 1,000 hours to teaching underprivileged children and transforming lives.",
    content: "Full article content here...",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
    author: "AGR Foundation",
    date: "2025-12-15",
    category: "success-story",
    readTime: 5,
  },
];

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

  const filteredNews = allNews.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredNews[0];
  const otherArticles = filteredNews.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 maroon-gradient">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                News & Stories
              </h1>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
                Stay updated with our latest initiatives, success stories, and the impact we're creating together.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative max-w-md w-full">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredArticle && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <AnimatedSection>
                <NewsCard article={featuredArticle} featured />
              </AnimatedSection>
            </div>
          </section>
        )}

        {/* All Articles */}
        <section className="py-12 section-cream">
          <div className="container mx-auto px-4">
            {otherArticles.length > 0 ? (
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherArticles.map((article) => (
                  <StaggerItem key={article.id}>
                    <NewsCard article={article} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No articles found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default News;
