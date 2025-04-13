interface Props {
  className?: string;
}

const Icon = ({ className }: Props) => {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeMiterlimit="4"
        strokeWidth="0.6275"
        d="M3.451 16l3.137-3.137 6.275 6.275 12.549-12.549 3.137 3.137-15.686 15.686-9.412-9.412z"
      ></path>
    </svg>
  );
};

export default Icon;
