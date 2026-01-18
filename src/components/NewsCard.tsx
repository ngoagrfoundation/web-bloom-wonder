import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: "success-story" | "announcement" | "event" | "community";
  readTime: number;
}

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

const categoryColors: Record<NewsArticle["category"], string> = {
  "success-story": "bg-green-50 text-green-700",
  announcement: "bg-blue-50 text-blue-700",
  event: "bg-secondary/10 text-secondary-foreground",
  community: "bg-purple-50 text-purple-700",
};

const categoryLabels: Record<NewsArticle["category"], string> = {
  "success-story": "Success Story",
  announcement: "Announcement",
  event: "Event",
  community: "Community",
};

const NewsCard = ({ article, featured = false }: NewsCardProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (featured) {
    return (
      <motion.article
        className="card-elevated overflow-hidden group"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Link to={`/news/${article.slug}`} className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-full overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 w-fit ${
                categoryColors[article.category]
              }`}
            >
              {categoryLabels[article.category]}
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
              {article.title}
            </h2>
            <p className="text-muted-foreground mb-6 line-clamp-3">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{formatDate(article.date)}</span>
              </div>
              <span>·</span>
              <span>{article.readTime} min read</span>
            </div>
            <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
              Read More <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      className="card-elevated overflow-hidden group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/news/${article.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-6">
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${
              categoryColors[article.category]
            }`}
          >
            {categoryLabels[article.category]}
          </span>
          <h3 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{formatDate(article.date)}</span>
            <span>·</span>
            <span>{article.readTime} min</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default NewsCard;
