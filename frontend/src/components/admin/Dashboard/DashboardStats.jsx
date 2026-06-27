import React from 'react';
import { Card } from '../../../components/ui/card';
import * as LucideIcons from 'lucide-react';

const DashboardStats = ({ stats, loading }) => {
  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: 'Briefcase', color: 'text-primary' },
    { label: 'Active Services', value: stats.services, icon: 'Cpu', color: 'text-secondary' },
    { label: 'Client Testimonials', value: stats.testimonials, icon: 'MessageSquare', color: 'text-emerald-400' },
    stats.isSuperAdmin && { label: 'Admin Accounts', value: stats.admins, icon: 'Users', color: 'text-purple-400' }
  ].filter(Boolean);

  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, idx) => {
        const Icon = LucideIcons[stat.icon] || LucideIcons.HelpCircle;
        return (
          <Card key={idx} className="glass-card rounded-2xl border-white/5 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Icon size={80} />
            </div>
            <div className="flex items-center space-x-4">
              <div className={`p-3.5 rounded-2xl bg-white/5 ${stat.color} border border-white/5`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-white mt-1">
                  {loading ? (
                    <LucideIcons.Loader2 className="animate-spin" size={28} />
                  ) : (
                    stat.value ?? 0
                  )}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default React.memo(DashboardStats);
