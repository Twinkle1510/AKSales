// Temporary shims to avoid TS module-not-found diagnostics
declare module 'react' {
  const React: any;
  export = React;
}

declare module 'lucide-react' {
  const icons: any;
  export = icons;
}
