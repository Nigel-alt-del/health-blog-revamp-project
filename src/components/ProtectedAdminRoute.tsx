
interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  // No authentication required - direct access to admin
  return <>{children}</>;
};

export default ProtectedAdminRoute;
