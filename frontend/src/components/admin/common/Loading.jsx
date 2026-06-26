import React from 'react';
import * as LucideIcons from 'lucide-react';

const Loading = ({ label = 'Loading section...' }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-6 py-16 text-center text-muted-foreground">
    <LucideIcons.Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
    <p className="text-sm font-semibold">{label}</p>
  </div>
);

export default React.memo(Loading);
