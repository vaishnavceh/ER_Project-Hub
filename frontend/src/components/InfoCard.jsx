export default function InfoCard({ icon: Icon, title, children, accent = "sky" }) {
  const accentClasses = {
    amber: "bg-amber-100 text-amber-800",
    emerald: "bg-emerald-100 text-emerald-800",
    rose: "bg-rose-100 text-rose-800",
    sky: "bg-sky-100 text-sky-800",
    teal: "bg-teal-100 text-teal-800"
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      {Icon ? (
        <div className={`mb-4 grid h-10 w-10 place-items-center rounded-lg ${accentClasses[accent]}`}>
          <Icon size={21} aria-hidden="true" />
        </div>
      ) : null}
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-slate-600">{children}</div>
    </article>
  );
}
