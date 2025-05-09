import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { LOG_IN_PATH } from "../../common/common.ts";
import { AuthContext } from "../../context/AuthContext.ts";

interface AuthenticatedRouteProps {
  children: ReactNode;
}

/**
 * An authenticated route component that ensures access only to authenticated users.
 *
 * If the user is not authenticated, it redirects to the login page while preserving
 * the original intended destination.
 *
 * @component
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - The content to render within the authenticated route.
 * @returns {ReactNode} - Rendered component or redirection.
 *
 */
export default function AuthenticatedPaths({ children }: AuthenticatedRouteProps): JSX.Element {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (user === null) {
    return <Navigate to={LOG_IN_PATH} state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
