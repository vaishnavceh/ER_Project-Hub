export default function Navigation({ pages, activePage, onChange }) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Project hub navigation">
      {pages.map((page) => {
        const Icon = page.icon;
        const isActive = page.id === activePage;

        return (
          <button
            key={page.id}
            type="button"
            onClick={() => onChange(page.id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "border-sky-700 bg-sky-700 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Icon size={16} aria-hidden="true" />
            {page.label}
          </button>
        );
      })}
    </nav>
  );
}
