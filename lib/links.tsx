import { ChartLine, Handshake, Users, TrendingDown } from "lucide-react";

// https://lucide.dev/icons/

export type UserRole = 'admin' | 'user'

type TLink = {
  title: string;
  url: string;
  icon: React.ReactNode;
  allowedRoles: UserRole[];
};

const adminLinks: TLink[] = [
  {
    title: 'Dashboard Clientes',
    url: '/admin/dashboard',
    icon: <ChartLine />,
    allowedRoles: ['admin', 'user']
  },
  {
    title: 'Dashboard Steigen',
    url: '/admin/dashboardsteigen',
    icon: <ChartLine />,
    allowedRoles: ['admin']
  },
  {
    title: 'Dashboard Sócios',
    url: '/admin/dashboardsocios',
    icon: <ChartLine />,
    allowedRoles: ['admin']
  },
  {
    title: 'Clientes',
    url: '/admin/clients',
    icon: <Users />,
    allowedRoles: ['admin']
  },
  {
    title: 'Sócios',
    url: '/admin/partners',
    icon: <Handshake />,
    allowedRoles: ['admin']
  },
  {
    title: 'Índices',
    url: '/admin/indices',
    icon: <TrendingDown />,
    allowedRoles: ['admin']
  }
];

export function getLinksByRole(role: UserRole): TLink[] {

  return adminLinks.filter(link => link.allowedRoles.includes(role));
}
