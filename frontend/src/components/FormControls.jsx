import { useEffect, useId, useMemo, useState } from "react";

export function TextInput({ label, name, value, onChange, placeholder, required = false, type = "text", helperText, ...props }) {
  const inputId = useId();
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-describedby={helperId}
        {...props}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-500"
      />
      {helperText ? (
        <span id={helperId} className="mt-1 block text-xs leading-5 text-slate-500">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

export function TextArea({ label, name, value, onChange, placeholder, required = false, helperText, ...props }) {
  const inputId = useId();
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <textarea
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-describedby={helperId}
        rows={4}
        {...props}
        className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-500"
      />
      {helperText ? (
        <span id={helperId} className="mt-1 block text-xs leading-5 text-slate-500">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

export function SelectInput({ label, name, value, onChange, children, helperText, ...props }) {
  const inputId = useId();
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <select
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        aria-describedby={helperId}
        {...props}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-sky-500"
      >
        {children}
      </select>
      {helperText ? (
        <span id={helperId} className="mt-1 block text-xs leading-5 text-slate-500">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

export function SearchableSelectInput({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  placeholder = "Search or select",
  helperText
}) {
  const inputId = useId();
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const listboxId = `${inputId}-listbox`;
  const normalizedOptions = useMemo(
    () => options.map((option) => (typeof option === "string" ? { label: option, value: option } : option)),
    [options]
  );
  const selectedOption = normalizedOptions.find((option) => option.value === value);
  const [query, setQuery] = useState(selectedOption?.label || "");
  const [isOpen, setIsOpen] = useState(false);
  const filteredOptions = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return normalizedOptions;
    }

    return normalizedOptions.filter((option) =>
      `${option.label} ${option.value}`.toLowerCase().includes(search)
    );
  }, [normalizedOptions, query]);

  useEffect(() => {
    setQuery(selectedOption?.label || "");
  }, [selectedOption?.label]);

  function emitValue(nextValue) {
    onChange({
      target: {
        name,
        value: nextValue,
        type: "text"
      }
    });
  }

  function selectOption(option) {
    setQuery(option.label);
    setIsOpen(false);
    emitValue(option.value);
  }

  function handleInputChange(event) {
    const nextQuery = event.target.value;
    const exactOption = normalizedOptions.find(
      (option) =>
        option.label.toLowerCase() === nextQuery.trim().toLowerCase() ||
        option.value.toLowerCase() === nextQuery.trim().toLowerCase()
    );

    setQuery(nextQuery);
    setIsOpen(true);
    emitValue(exactOption?.value || "");
  }

  function handleBlur() {
    window.setTimeout(() => {
      const exactOption = normalizedOptions.find(
        (option) =>
          option.label.toLowerCase() === query.trim().toLowerCase() ||
          option.value.toLowerCase() === query.trim().toLowerCase()
      );

      if (exactOption) {
        selectOption(exactOption);
      } else {
        setQuery(selectedOption?.label || "");
        setIsOpen(false);
      }
    }, 120);
  }

  return (
    <div className="relative block">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-describedby={helperId}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-500"
      />
      {helperText ? (
        <span id={helperId} className="mt-1 block text-xs leading-5 text-slate-500">
          {helperText}
        </span>
      ) : null}
      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}
                className={`block w-full px-3 py-2 text-left hover:bg-sky-50 ${
                  option.value === value ? "bg-sky-100 text-sky-950" : "text-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-slate-500">No matching option</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
