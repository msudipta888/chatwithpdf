import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  className 
}: FeatureCardProps) => {
  return (
    <div className={cn(
      "retro-container card-with-hover h-full",
      className
    )}>
      <div className="flex flex-col items-center text-center p-6 space-y-4">
        <div className=" bg-gradient-to-tr
         from-[#704B9D]
         via-[#D946EE]
         to-[#E95C82] p-3 rounded-lg">
          <Icon className="h-8 w-8 text-black" />
        </div>
        <h3 className="text-xl font-bold terminal-text">{title}</h3>
        <p className="text-foreground/80">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;