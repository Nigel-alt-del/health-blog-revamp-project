
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const categoryButtons = [
  { name: "PMI Insights", slug: "pmi-insights", color: "bg-blue-500 hover:bg-blue-600" },
  { name: "Healthcare", slug: "healthcare", color: "bg-green-500 hover:bg-green-600" },
  { name: "Digital Health", slug: "digital-health", color: "bg-purple-500 hover:bg-purple-600" },
  { name: "Mental Health", slug: "mental-health", color: "bg-teal-500 hover:bg-teal-600" }
];

const CategoryButtons = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-[#20466d] mb-8 text-center">
        Explore Our Categories
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryButtons.map((category) => (
          <Link key={category.slug} to={`/category/${category.slug}`}>
            <Button 
              className={`w-full h-24 text-lg font-semibold text-white ${category.color} transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-between`}
            >
              <span>{category.name}</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryButtons;
