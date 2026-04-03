import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { MobileLayout } from "@/components/mobile";
import AnimatedSection from "@/components/AnimatedSection";
import { NewsArticle } from "@/components/NewsCard";
import { sanitizeHTML, createShareUrl } from "@/lib/sanitize";
import { fetchNewsBySlug, fetchPublicNews } from "@/lib/api";

const NewsArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    
    Promise.all([
      fetchNewsBySlug(slug),
      fetchPublicNews(),
    ]).then(([data, allNews]) => {
      if (data) {
        const mapped: NewsArticle = {
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
        };
        setArticle(mapped);

        // SEO meta tags
        const metaTitle = String(data.meta_title || data.title || '');
        const metaDesc = String(data.meta_description || data.excerpt || '');
        document.title = `${metaTitle} | AGR Foundation`;
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) descMeta.setAttribute('content', metaDesc);
        else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = metaDesc;
          document.head.appendChild(meta);
        }
      }

      // Related articles from API
      if (allNews && Array.isArray(allNews)) {
        const related = allNews
          .filter((n: Record<string, unknown>) => String(n.slug) !== slug)
          .slice(0, 3)
          .map((n: Record<string, unknown>): NewsArticle => ({
            id: String(n.id || ''),
            slug: String(n.slug || ''),
            title: String(n.title || ''),
            excerpt: String(n.excerpt || ''),
            content: '',
            image: String(n.image || ''),
            author: String(n.author || 'AGR Foundation'),
            date: String(n.published_at || ''),
            category: (n.category as NewsArticle['category']) || 'announcement',
            readTime: Number(n.read_time || 3),
          }));
        setRelatedArticles(related);
      }

      setLoading(false);
    });

    return () => { document.title = 'AGR Foundation'; };
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

        {relatedArticles.length > 0 && (
          <section className="py-16 section-cream mt-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">More Stories</h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {relatedArticles.map((relatedArticle) => (
                  <Link key={relatedArticle.id} to={`/news/${relatedArticle.slug}`} className="card-elevated p-4 group">
                    {relatedArticle.image && <img src={relatedArticle.image} alt={relatedArticle.title} className="w-full h-32 object-cover rounded-lg mb-3" loading="lazy" />}
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{relatedArticle.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </MobileLayout>
  );
};

export default NewsArticlePage;
