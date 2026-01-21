import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { MobileLayout } from "@/components/mobile";
import AnimatedSection from "@/components/AnimatedSection";
import { NewsArticle } from "@/components/NewsCard";
import { sanitizeHTML, createShareUrl } from "@/lib/sanitize";

const allNews: NewsArticle[] = [
  {
    id: "1",
    slug: "100-students-graduate-skill-program",
    title: "100 Students Graduate from Our Skill Development Program",
    excerpt: "A milestone celebration as our latest batch of students complete vocational training, ready to enter the workforce with confidence.",
    content: `
      <p>In a heartwarming ceremony held at the AGR Foundation Community Center, 100 students received their certificates after completing our comprehensive skill development program. This milestone marks another step forward in our mission to empower underserved communities through education and vocational training.</p>
      
      <h2>A Journey of Transformation</h2>
      <p>The graduates, aged between 18 and 35, underwent six months of intensive training in various trades including computer skills, tailoring, electrical work, and beautician courses. Many of these students come from families with limited access to quality education and employment opportunities.</p>
      
      <p>"This program changed my life," says Priya, 23, who completed the computer skills course. "I came from a small village with no knowledge of computers. Today, I have a job offer from a local IT company."</p>
      
      <h2>Beyond Skills: Building Confidence</h2>
      <p>Our program goes beyond technical training. Students also receive soft skills training, career counseling, and job placement assistance. This holistic approach ensures they're not just skilled, but confident and ready for the professional world.</p>
      
      <p>The foundation has partnered with over 50 local businesses that have committed to hiring our graduates, providing them with immediate employment opportunities upon completion of the program.</p>
      
      <h2>Looking Ahead</h2>
      <p>With this batch, AGR Foundation has now trained over 1,500 students since the program's inception in 2018. We're expanding our training centers to three new locations next year, aiming to reach even more aspiring individuals.</p>
      
      <p>We invite community members and businesses to support this initiative. Whether through donations, volunteering, or providing internship opportunities, every contribution helps transform lives.</p>
    `,
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200",
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
    content: `
      <p>AGR Foundation is proud to announce the launch of our Mobile Health Clinic initiative, a groundbreaking program designed to bring quality healthcare directly to rural communities that lack access to medical facilities.</p>
      
      <h2>Healthcare at Your Doorstep</h2>
      <p>Our fleet of three fully-equipped mobile clinics will travel to remote villages across Maharashtra, providing free health check-ups, basic treatments, and health education to thousands of residents who otherwise would have to travel hours to reach a hospital.</p>
      
      <p>Each mobile unit is staffed with qualified doctors, nurses, and healthcare workers, equipped with diagnostic tools, medicines, and emergency care capabilities.</p>
      
      <h2>Comprehensive Services</h2>
      <p>The mobile clinics offer a range of services including:</p>
      <ul>
        <li>General health check-ups</li>
        <li>Eye examinations and free spectacles</li>
        <li>Dental care</li>
        <li>Women's health services</li>
        <li>Child immunizations</li>
        <li>Chronic disease management</li>
      </ul>
      
      <h2>Impact Goals</h2>
      <p>In the first year, we aim to reach 50 villages and serve over 25,000 patients. The program will also train local health workers to provide basic care and health education in their communities.</p>
      
      <p>This initiative is made possible through generous support from our donors and partnerships with leading healthcare institutions.</p>
    `,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200",
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
    content: `
      <p>The AGR Foundation Annual Charity Gala 2026 was a resounding success, bringing together philanthropists, business leaders, and community members for an evening of celebration and giving. The event raised a record-breaking ₹50 lakhs, surpassing our goal by 25%.</p>
      
      <h2>An Evening to Remember</h2>
      <p>Held at the Grand Ballroom of the Taj Hotel Mumbai, the gala featured live performances by renowned artists, a silent auction of exclusive items, and inspiring testimonials from program beneficiaries whose lives have been transformed by the foundation's work.</p>
      
      <h2>Where the Funds Will Go</h2>
      <p>The funds raised will support our three core programs:</p>
      <ul>
        <li>Education: Scholarships and learning materials for 500 students</li>
        <li>Healthcare: Expansion of mobile health clinics to five new districts</li>
        <li>Livelihood: New vocational training center in Pune</li>
      </ul>
      
      <h2>Gratitude to Our Supporters</h2>
      <p>We extend our heartfelt thanks to all attendees, sponsors, and donors who made this event possible. Special recognition goes to our platinum sponsors who contributed generously to the cause.</p>
      
      <p>Mark your calendars for next year's gala - together, we can create even more impact.</p>
    `,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
    author: "AGR Foundation",
    date: "2026-01-05",
    category: "event",
    readTime: 5,
  },
];

const NewsArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = allNews.find((a) => a.slug === slug);

  if (!article) {
    return (
      <MobileLayout>
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              Article Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/news" className="btn-primary">
              Back to News
            </Link>
          </div>
        </main>
      </MobileLayout>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Use safe URL encoding for share links
  const currentUrl = window.location.href;

  return (
    <MobileLayout>
      <main className="pt-14 md:pt-20">
        {/* Hero Image */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>

        {/* Article Content */}
        <article className="container mx-auto px-4 -mt-32 relative z-10">
          <AnimatedSection className="max-w-3xl mx-auto">
            {/* Back Button */}
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to News
            </Link>

            {/* Article Header */}
            <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                {article.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(article.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{article.readTime} min read</span>
                </div>
              </div>

              {/* Article Body - Sanitized HTML */}
              <div
                className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }}
              />

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Share2 size={18} />
                    <span className="text-sm font-medium">Share this article</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={createShareUrl("facebook", currentUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <Facebook size={18} />
                    </a>
                    <a
                      href={createShareUrl("twitter", currentUrl, article.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <Twitter size={18} />
                    </a>
                    <a
                      href={createShareUrl("linkedin", currentUrl, article.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </article>

        {/* Related Articles */}
        <section className="py-16 section-cream mt-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">
              More Stories
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {allNews
                .filter((a) => a.id !== article.id)
                .slice(0, 3)
                .map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    to={`/news/${relatedArticle.slug}`}
                    className="card-elevated p-4 group"
                  >
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {relatedArticle.title}
                    </h3>
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