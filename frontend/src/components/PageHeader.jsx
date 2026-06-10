export default function PageHeader({ eyebrow, title, children }) {
  return (
    <div className="mb-6 max-w-3xl">
      {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase text-teal-700">{eyebrow}</p> : null}
      <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">{title}</h1>
      {children ? <div className="mt-3 text-base leading-7 text-slate-600">{children}</div> : null}
    </div>
  );
}
