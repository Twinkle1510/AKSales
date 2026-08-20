// Temporary shims to avoid TS module-not-found diagnostics while deps install
declare module 'react' {
  export function useState<T>(initial?: T | (() => T)): [T, (v: any) => void];
  export function useEffect(fn: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initial?: T): { current: T | null };
  export const Fragment: any;
  export namespace JSX {
    interface IntrinsicElements { [elem: string]: any }
  }
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any): any;
  export function jsxs(type: any, props: any): any;
  export const Fragment: any;
}

// Named exports used from lucide-react across the app
declare module 'lucide-react' {
  export const Menu: any;
  export const Search: any;
  export const Bell: any;
  export const Mail: any;
  export const Settings: any;
  export const Plus: any;
  export const CheckCircle: any;
  export const Clock: any;
  export const Eye: any;
  export const ClipboardCheck: any;
  export const LayoutGrid: any;
  export const Table: any;
  export const AlertCircle: any;
  export const CircleDollarSign: any;
  export const FileSpreadsheet: any;
  export const Printer: any;
  export const Calendar: any;
  export const ArrowRight: any;
  export const AlertTriangle: any;
  export const Edit2: any;
  export const CheckCircle2: any;
  export const XCircle: any;
  export const Image: any;
  export const Edit: any;
  export const Hammer: any;
  export const Layers: any;
  export const PlayCircle: any;
  export const UserCheck: any;
  export const LayoutDashboard: any;
  export const ClipboardList: any;
  export const CheckSquare: any;
  export const History: any;
  export const ChefHat: any;
  export const Users: any;
  export const PackageOpen: any;
  export const Hourglass: any;
  export const TrendingUp: any;
  export const Globe: any;
  export const Percent: any;
  export default {} as any;
}
