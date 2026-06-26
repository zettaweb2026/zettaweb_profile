import React from 'react';
import { Button } from '../../../components/ui/button';
import * as LucideIcons from 'lucide-react';

const inputStyle = "w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium text-sm";
const labelStyle = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2";

const LeadsManager = ({ items = [], loading, editingItem, onSave, onDelete, onEdit, onCancel, onStatusChange }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-6 py-16 text-center text-muted-foreground">
        <LucideIcons.Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-semibold">Loading client records...</p>
      </div>
    );
  }

  if (editingItem) {
    return (
      <form onSubmit={(e) => onSave(e, 'leads')} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2 p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary">
            <p className="font-semibold flex items-center gap-2 mb-1">
              <LucideIcons.CheckCircle size={16} /> Firebase Integration Active
            </p>
            <p className="text-primary/80">Client records are stored through the existing Firebase-backed API.</p>
          </div>
          <div>
            <label className={labelStyle}>Company Name</label>
            <input name="companyName" defaultValue={editingItem.companyName} placeholder="e.g. Acme Corp" required className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Phone Number</label>
            <input name="phone" defaultValue={editingItem.phone} placeholder="e.g. +1 234 567 8900" required className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Email Address</label>
            <input name="email" type="email" defaultValue={editingItem.email} placeholder="e.g. contact@acme.com" required className={inputStyle} />
          </div>
          <input type="hidden" name="status" value={editingItem.status || 'Not Received'} />
        </div>
        <div className="flex gap-4 pt-6 border-t border-white/5 mt-8">
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-1.5 transition-all">
            <LucideIcons.Save size={16} />
            <span>Save Record</span>
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="border-white/10 text-white hover:bg-white/5 px-6 py-2.5 rounded-xl font-semibold transition-all">
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-16 text-muted-foreground border border-dashed border-white/10 rounded-2xl bg-black/10">
        <LucideIcons.Inbox size={48} className="mx-auto mb-3 opacity-20" />
        <p className="text-sm font-semibold">No client records found. Click 'Add New' to create one.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
      <table className="w-full text-left text-sm text-muted-foreground">
        <thead className="bg-white/5 text-xs uppercase text-white font-semibold">
          <tr>
            <th className="px-6 py-4">Company Name</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-medium text-white">{item.companyName}</td>
              <td className="px-6 py-4">{item.phone}</td>
              <td className="px-6 py-4">{item.email}</td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {['Not Received', 'Received Call', 'In Progress', 'Closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => onStatusChange(item.id, status)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${(item.status === status || (!item.status && status === 'Not Received')) ? (status === 'Received Call' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : status === 'Closed' ? 'bg-primary/20 text-primary border border-primary/30' : status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-destructive/20 text-destructive border border-destructive/30') : 'bg-black/40 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/5'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => onEdit(item)} className="bg-white/5 hover:bg-white/10 text-white rounded-lg px-3 py-1 transition-all">
                    <LucideIcons.Edit size={14} />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete('leads', item.id)} className="rounded-lg px-3 py-1 transition-all">
                    <LucideIcons.Trash2 size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(LeadsManager);
