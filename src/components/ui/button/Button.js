import Link from "next/link";

const variants = {
  brand:
    "bg-[var(--background-brand,#755C44)] text-white hover:bg-brand-primary-hover",
};

export default function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "brand",
  className = "",
  ...props
}) {
  const classes = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-medium transition-colors ${variants[variant] ?? variants.brand} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}
