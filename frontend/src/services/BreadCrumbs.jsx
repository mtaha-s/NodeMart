import { Link } from "react-router-dom";

export default function Breadcrumbs({ paths = [] }) {
  return (
    <nav className="text-sm mb-4">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-[#2B9CCF] hover:underline">
            Home
          </Link>
        </li>

        {paths.map((crumb, index) => {
          const isLast = index === paths.length - 1;
          return (
            <li key={index} className="flex items-center space-x-2">
              <span className="text-[#2B9CCF]">/</span>
              {crumb.path && !isLast ? (
                <Link
                  to={crumb.path}
                  className="text-[#2B9CCF] hover:underline capitalize"
                >
                  {crumb.name}
                </Link>
              ) : (
                <span
                  className={`capitalize ${
                    isLast ? "text-[#49AD5E] font-medium" : "text-[#49AD5E]"
                  }`}
                >
                  {crumb.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
