import { Link } from "react-router-dom";
import { Calendar, ArrowRight, User } from "lucide-react";
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
  "success-story": "bg-green-100 text-green-700",
  announcement: "bg-blue-100 text-blue-700",
  event: "bg-secondary/20 text-secondary-foreground",
  community: "bg-purple-100 text-purple-700",
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
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (featured) {
    return (
      <motion.article
        className="card-elevated overflow-hidden group"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Link to={`/news/${article.slug}`} className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-full overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
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
                <User size={16} />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(article.date)}</span>
              </div>
              <span>{article.readTime} min read</span>
            </div>
            <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
              Read More <ArrowRight size={18} />
            </span>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      className="card-elevated overflow-hidden group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
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
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
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
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{formatDate(article.date)}</span>
            </div>
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default NewsCard;
