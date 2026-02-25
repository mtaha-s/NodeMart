import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-sm mb-4">
      <ol className="flex space-x-2">
        <li>
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        </li>
        {pathnames.map((value, index) => {
          const to = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;
          return (
            <li key={to} className="flex items-center space-x-2">
              <span>/</span>
              {isLast ? (
                <span className="text-gray-700 capitalize">{value}</span>
              ) : (
                <Link to={to} className="text-blue-600 hover:underline capitalize">
                  {value}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
