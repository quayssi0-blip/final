const Button = ({ children, href, className = "", ...props }) => {
  const baseClasses =
    "font-bold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed";

  const classes = `rounded-full px-8 py-4 shadow-xl hover:scale-[1.05] hover:shadow-2xl bg-primary text-white`;

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${classes} ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={`${baseClasses} ${classes} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
