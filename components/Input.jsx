"use client";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-[var(--hiroma-text)]">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full rounded-[var(--radius-md)]
          border border-[var(--hiroma-border)]
          bg-white px-4 py-3
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--hiroma-blue)]
        "
      />
    </div>
  );
}
