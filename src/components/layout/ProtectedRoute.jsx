import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';
import { findNavItemByPath, modulForItem, firstAccessiblePath } from '../../data/navConfig';

export default function ProtectedRoute() {
  const { user } = useAuth();
  const { hakAkses } = useData();
  const { notifyError } = useNotify();
  const location = useLocation();
  const navigate = useNavigate();

  const found = findNavItemByPath(location.pathname);
  const modul = found ? modulForItem(found.group, found.item) : null;
  const diizinkan = !modul || !!(hakAkses[user?.role] || {})[modul];

  useEffect(() => {
    if (user && modul && !diizinkan) {
      notifyError(`Role "${user.role}" tidak punya akses ke modul "${modul}".`);
      navigate(firstAccessiblePath(user.role, hakAkses), { replace: true });
    }
  }, [location.pathname, user?.role]);

  if (!user) return <Navigate to="/login" replace />;
  if (modul && !diizinkan) return null;
  return <Outlet />;
}
