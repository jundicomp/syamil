import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { firstAccessiblePath } from '../../data/navConfig';

/** Redirect "/" ke halaman pertama yang boleh diakses role user ini (bukan /dashboard yang hardcode). */
export default function HomeRedirect() {
  const { user } = useAuth();
  const { hakAkses } = useData();
  return <Navigate to={firstAccessiblePath(user?.role, hakAkses)} replace />;
}
