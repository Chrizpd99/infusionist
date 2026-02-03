import { Link } from "wouter";

export function CategoryNav({ categories }: { categories: string[] }) {
  return (
    <nav className="sticky top-24 z-40 mb-8">
      <div className="backdrop-blur glass-panel px-4 py-3 rounded-full max-w-4xl mx-auto flex gap-3 overflow-auto">
        {categories.map((cat) => {
          const id = cat.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          return (
            <Link key={cat} href={`#${id}`} className="flex-shrink-0">
              <a className="px-4 py-2 rounded-lg text-sm font-semibold text-white/90 hover:text-white hover:bg-white/5 transition-colors">
                {cat}
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
