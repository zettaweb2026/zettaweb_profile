import React, { useState } from 'react';
import { Users, Search, Plus, Mail, Phone, FileText, CheckCircle, Clock } from 'lucide-react';
import { UIverseCard, UIverseButton, UIverseBadge } from '@/components/ui/uiverse';

export const ClientsManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([
    {
      id: '1',
      name: 'TechStart Inc.',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@techstart.io',
      phone: '+91 9876543210',
      totalBilled: 150000,
      activeContracts: 2,
      status: 'Active',
    },
    {
      id: '2',
      name: 'DataFlow Systems',
      contactPerson: 'Michael Chen',
      email: 'mchen@dataflow.com',
      phone: '+91 9812345678',
      totalBilled: 280000,
      activeContracts: 1,
      status: 'Active',
    },
    {
      id: '3',
      name: 'HealthCare Plus',
      contactPerson: 'Emily Rodriguez',
      email: 'emily@healthcareplus.org',
      phone: '+91 9765432109',
      totalBilled: 95000,
      activeContracts: 0,
      status: 'Pending Contract',
    },
  ]);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-8 p-6 bg-slate-950 text-white min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Users className="h-7 w-7 text-cyan-400" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
              Client Management Directory
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Manage your client relations, track ongoing agreements, and view billing history.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-cyan-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <UIverseCard
            key={client.id}
            title={client.name}
            subtitle={`Primary Contact: ${client.contactPerson}`}
            icon={Users}
            badgeText={client.status}
            glowColor="from-cyan-500 via-indigo-500 to-purple-600"
          >
            <div className="space-y-3 pt-2 text-sm text-slate-300 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>{client.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-400" />
                <span>{client.phone}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs">
                  <span className="text-slate-400 block">Total Billed</span>
                  <span className="text-base font-bold text-cyan-400">
                    ₹{client.totalBilled.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="text-xs text-right">
                  <span className="text-slate-400 block">Contracts</span>
                  <span className="text-sm font-semibold text-slate-200">
                    {client.activeContracts} Active
                  </span>
                </div>
              </div>
            </div>
          </UIverseCard>
        ))}
      </div>
    </div>
  );
};

export default ClientsManager;
