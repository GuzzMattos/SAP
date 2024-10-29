import { ChartLine, Handshake, Users } from "lucide-react";

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
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: <ChartLine />,
    allowedRoles: ['admin', 'user']
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
  }
];

export function getLinksByRole(role: UserRole): TLink[] {

  return adminLinks.filter(link => link.allowedRoles.includes(role));
}
