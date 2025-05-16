import {
  FaTags,
  FaExchangeAlt,
  FaConciergeBell,
  FaClock,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";

export const dataMenu = [
  {
    name: "Transações",
    link: "",
    icon: <></>,
    children: [
      { name: "Categorias", link: "/painel/categorias" },
      { name: "Transações", link: "/painel" },
    ],
  },
  {
    name: "Seu negocio",
    link: "",
    icon: <></>,
    children: [
      { name: "Serviços", link: "/painel/services" },
      { name: "Configurar Horarios", link: "/painel/schedules", icon: <></> },
      {
        name: "Horarios Agendados",
        link: "/painel/scheduled-times",
        icon: <></>,
      },
      { name: "Perfil", link: "/painel/perfil" },
    ],
  },
];

export const links = [
  // {
  //   name: "Categorias",
  //   link: "/painel/categorias",
  //   icon: <FaTags size={22} />,
  // },
  { name: "Transações", link: "/painel", icon: <FaExchangeAlt size={22} /> },
  {
    name: "Serviços",
    link: "/painel/services",
    icon: <FaConciergeBell size={22} />,
  },
  {
    name: "Horários",
    link: "/painel/schedules",
    icon: <FaClock size={22} />,
  },
  {
    name: "Agendados",
    link: "/painel/scheduled-times",
    icon: <FaCalendarAlt size={22} />,
  },
  { name: "Perfil", link: "/painel/perfil", icon: <FaUser size={22} /> },
];
