import Streak from "./Streak";

interface Props {
  category: string;
  setCategory: (category: string) => void;
}

export function FilterSection({ category, setCategory }: Props) {
  const categories = ["all", "life", "health", "academic", "hobby"];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              category === cat ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <Streak />
    </div>
  );
};