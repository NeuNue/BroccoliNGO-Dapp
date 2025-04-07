interface Props {
  className?: string;
}
const Icon = ({ className }: Props) => {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeMiterlimit="4"
        strokeWidth="0.6667"
        d="M2.668 16l3.333-3.333 6.667 6.667 13.333-13.333 3.333 3.333-16.667 16.667-10-10z"
      ></path>
    </svg>
  );
};

export default Icon;
