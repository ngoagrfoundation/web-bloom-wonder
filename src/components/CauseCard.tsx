import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface CauseCardProps {
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  link: string;
}

const CauseCard = ({ title, description, image, goal, raised, link }: CauseCardProps) => {
  const progress = Math.min((raised / goal) * 100, 100);

  return (
    <motion.div
      className="card-elevated overflow-hidden group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Raised: ₹{raised.toLocaleString()}</span>
            <span className="text-primary font-medium">Goal: ₹{goal.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}% funded</p>
        </div>

        <div className="flex gap-3">
          <Link to="/donate" className="btn-primary text-sm py-2 px-4 flex-1 text-center">
            Donate Now
          </Link>
          <Link to={link} className="btn-outline text-sm py-2 px-4 flex-1 text-center">
            Learn More
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CauseCard;
