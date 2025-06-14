
import { Badge } from "@/components/ui/badge";

interface FilterBadgesProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const FilterBadges = ({ categories, selectedCategory, onCategorySelect }: FilterBadgesProps) => {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedCategory === category
                ? "bg-[#22aee1] text-white"
                : "border-[#22aee1] text-[#22aee1] hover:bg-[#22aee1] hover:text-white"
            }`}
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default FilterBadges;
