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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-5 line-clamp-2">
          {description}
        </p>
        
        {/* Progress Bar - Thinner and cleaner */}
        <div className="mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground font-medium">₹{raised.toLocaleString()}</span>
            <span className="text-muted-foreground">of ₹{goal.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">{Math.round(progress)}% funded</p>
        </div>

        <div className="flex gap-3">
          <Link to="/donate" className="btn-primary text-sm py-2.5 px-4 flex-1 text-center">
            Donate
          </Link>
          <Link to={link} className="text-primary hover:text-primary/80 text-sm py-2.5 px-4 flex-1 text-center font-medium transition-colors">
            Learn More
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CauseCard;
