
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const categoryButtons = [
  { 
    name: "PMI Insights", 
    slug: "pmi-insights", 
    color: "bg-gradient-to-br from-red-600 via-rose-500 to-pink-600 hover:from-red-700 hover:via-rose-600 hover:to-pink-700" 
  },
  { 
    name: "Healthcare", 
    slug: "healthcare", 
    color: "bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 hover:from-emerald-700 hover:via-teal-600 hover:to-cyan-700" 
  },
  { 
    name: "Digital Health", 
    slug: "digital-health", 
    color: "bg-gradient-to-br from-purple-600 via-indigo-500 to-purple-700 hover:from-purple-700 hover:via-indigo-600 hover:to-purple-800" 
  },
  { 
    name: "Mental Health", 
    slug: "mental-health", 
    color: "bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-600 hover:from-teal-700 hover:via-cyan-600 hover:to-blue-700" 
  }
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
              className={`w-full h-24 text-lg font-semibold text-white ${category.color} transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-between shadow-md`}
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
