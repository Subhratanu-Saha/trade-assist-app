function Button({
  label,
  type = "button",
  onClick,
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 rounded-md bg-[#0A2947] px-3 py-3 text-base font-semibold text-white transition duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
    >
    {label}
    </button>
  );
}
export default Button;