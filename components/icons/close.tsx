interface Props {
  className?: string;
}

const Icon = ({ className }: Props) => {
  return (
    <svg
      className={className}
      viewBox="0 0 31 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="currentColor" d="M15.358 13.606l6.336-6.336 1.81 1.81-6.336 6.336 6.336 6.336-1.81 1.81-6.336-6.336-6.336 6.336-1.81-1.81 6.336-6.336-6.336-6.336 1.81-1.81 6.336 6.336z"></path>
    </svg>
  );
};

export default Icon;
