import {
  CodeBracketIcon,
  PaintBrushIcon,
  ShoppingCartIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CubeIcon,
  ServerIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";

export const AVAILABLE_ICONS = [
  { name: "Code", value: "fas fa-code", component: CodeBracketIcon },
  { name: "Design", value: "fas fa-paint-brush", component: PaintBrushIcon },
  {
    name: "E-commerce",
    value: "fas fa-shopping-cart",
    component: ShoppingCartIcon,
  },
  { name: "Web", value: "fas fa-globe", component: GlobeAltIcon },
  {
    name: "Mobile",
    value: "fas fa-mobile-alt",
    component: DevicePhoneMobileIcon,
  },
  { name: "Cloud", value: "fas fa-cloud", component: CloudIcon },
  { name: "Security", value: "fas fa-shield-alt", component: ShieldCheckIcon },
  { name: "Analytics", value: "fas fa-chart-bar", component: ChartBarIcon },
  { name: "3D", value: "fas fa-cube", component: CubeIcon },
  { name: "Server", value: "fas fa-server", component: ServerIcon },
  { name: "AI / ML", value: "fas fa-robot", component: CpuChipIcon },
  {
    name: "Maintenance",
    value: "fas fa-tools",
    component: WrenchScrewdriverIcon,
  },
  {
    name: "Digital Marketing",
    value: "fas fa-bullhorn",
    component: MegaphoneIcon,
  },
];
