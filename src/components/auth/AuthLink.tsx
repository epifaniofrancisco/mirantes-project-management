interface AuthLinkProps {
  questionText: string;
  linkText: string;
  onNavigate: () => void;
}

export const AuthLink: React.FC<AuthLinkProps> = ({
  questionText,
  linkText,
  onNavigate,
}) => (
  <div className="mt-6 text-center">
    <p className="text-sm text-slate-600">
      {questionText}{" "}
      <button
        type="button"
        onClick={onNavigate}
        className="cursor-pointer font-medium text-blue-500 transition-colors hover:text-blue-600 focus:underline focus:outline-none"
      >
        {linkText}
      </button>
    </p>
  </div>
);
