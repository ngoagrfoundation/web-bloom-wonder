import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { MobileLayout } from "@/components/mobile";
import AnimatedSection from "@/components/AnimatedSection";
import { NewsArticle } from "@/components/NewsCard";
import { sanitizeHTML, createShareUrl } from "@/lib/sanitize";
import { fetchNewsBySlug } from "@/lib/api";

const staticArticles: NewsArticle[] = [
  {
    id: "1", slug: "100-students-graduate-skill-program",
    title: "100 Students Graduate from Our Skill Development Program",
    excerpt: "A milestone celebration as our latest batch of students complete vocational training.",
    content: `<p>In a heartwarming ceremony held at the AGR Foundation Community Center, 100 students received their certificates after completing our comprehensive skill development program.</p><h2>A Journey of Transformation</h2><p>The graduates, aged between 18 and 35, underwent six months of intensive training in various trades including computer skills, tailoring, electrical work, and beautician courses.</p><h2>Looking Ahead</h2><p>With this batch, AGR Foundation has now trained over 1,500 students since the program's inception in 2025.</p>`,
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200",
    author: "AGR Foundation", date: "2026-01-15", category: "success-story", readTime: 4,
  },
  {
    id: "2", slug: "new-healthcare-initiative-launch",
    title: "Launching Mobile Health Clinics in Rural Areas",
    excerpt: "Our new initiative brings essential healthcare services directly to underserved communities.",
    content: `<p>AGR Foundation is proud to announce the launch of our Mobile Health Clinic initiative.</p><h2>Healthcare at Your Doorstep</h2><p>Our fleet of three fully-equipped mobile clinics will travel to remote villages across Maharashtra.</p>`,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200",
    author: "Dr. Priya Sharma", date: "2026-01-10", category: "announcement", readTime: 3,
  },
  {
    id: "3", slug: "annual-fundraiser-gala-2026",
    title: "Annual Charity Gala Raises Record ₹50 Lakhs",
    excerpt: "Our community came together for an unforgettable evening of giving.",
    content: `<p>The AGR Foundation Annual Charity Gala 2026 was a resounding success, raising a record-breaking ₹50 lakhs.</p><h2>Where the Funds Will Go</h2><ul><li>Education: Scholarships for 500 students</li><li>Healthcare: Expansion of mobile clinics</li><li>Livelihood: New vocational training center</li></ul>`,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
    author: "AGR Foundation", date: "2026-01-05", category: "event", readTime: 5,
  },
];

const NewsArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    fetchNewsBySlug(slug).then((data) => {
      if (data) {
        setArticle({
          id: String(data.id || ''),
          slug: String(data.slug || ''),
          title: String(data.title || ''),
          excerpt: String(data.excerpt || ''),
          content: String(data.content || ''),
          image: String(data.image || ''),
          author: String(data.author || 'AGR Foundation'),
          date: String(data.published_at || data.created_at || ''),
          category: (data.category as NewsArticle['category']) || 'announcement',
          readTime: Number(data.read_time || 3),
        });
      } else {
        // Fallback to static
        const found = staticArticles.find((a) => a.slug === slug);
        setArticle(found || null);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <MobileLayout>
        <main className="pt-32 pb-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </main>
      </MobileLayout>
    );
  }

  if (!article) {
    return (
      <MobileLayout>
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been moved.</p>
            <Link to="/news" className="btn-primary">Back to News</Link>
          </div>
        </main>
      </MobileLayout>
    );
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const currentUrl = window.location.href;

  return (
    <MobileLayout>
      <main className="pt-14 md:pt-20">
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>

        <article className="container mx-auto px-4 -mt-32 relative z-10">
          <AnimatedSection className="max-w-3xl mx-auto">
            <Link to="/news" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={18} /> Back to News
            </Link>

            <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">{article.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-2"><User size={16} /><span>{article.author}</span></div>
                <div className="flex items-center gap-2"><Calendar size={16} /><span>{formatDate(article.date)}</span></div>
                <div className="flex items-center gap-2"><Clock size={16} /><span>{article.readTime} min read</span></div>
              </div>

              <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }}
              />

              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground"><Share2 size={18} /><span className="text-sm font-medium">Share this article</span></div>
                  <div className="flex items-center gap-3">
                    <a href={createShareUrl("facebook", currentUrl)} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Share on Facebook"><Facebook size={18} /></a>
                    <a href={createShareUrl("twitter", currentUrl, article.title)} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Share on Twitter"><Twitter size={18} /></a>
                    <a href={createShareUrl("linkedin", currentUrl, article.title)} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Share on LinkedIn"><Linkedin size={18} /></a>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </article>

        <section className="py-16 section-cream mt-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">More Stories</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {staticArticles.filter((a) => a.slug !== article.slug).slice(0, 3).map((relatedArticle) => (
                <Link key={relatedArticle.id} to={`/news/${relatedArticle.slug}`} className="card-elevated p-4 group">
                  <img src={relatedArticle.image} alt={relatedArticle.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{relatedArticle.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </MobileLayout>
  );
};

export default NewsArticlePage;
