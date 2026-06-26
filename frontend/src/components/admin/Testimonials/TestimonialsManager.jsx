import React from 'react';
import { Button } from '../../../components/ui/button';
import * as LucideIcons from 'lucide-react';

const inputStyle = "w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium text-sm";
const labelStyle = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2";

const TestimonialsManager = ({
  items = [],
  loading,
  editingItem,
  onSave,
  onDelete,
  onEdit,
  onCancel
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-6 py-16 text-center text-muted-foreground">
        <LucideIcons.Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-semibold">Loading testimonials...</p>
      </div>
    );
  }

  if (editingItem) {
    return (
      <form onSubmit={(e) => onSave(e, 'testimonials')} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelStyle}>Client Name</label>
            <input name="name" defaultValue={editingItem.name} placeholder="e.g. John Doe" required className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Client Role / Position</label>
            <input name="role" defaultValue={editingItem.role} placeholder="e.g. CEO, TechCorp" required className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Avatar Initials / Image</label>
            <input name="avatar" defaultValue={editingItem.avatar} placeholder="e.g. JD" required className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Rating (1-5)</label>
            <input name="rating" type="number" min="1" max="5" defaultValue={editingItem.rating || 5} placeholder="5" required className={inputStyle} />
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Feedback / Review</label>
            <textarea name="feedback" defaultValue={editingItem.feedback} placeholder="What was it like working with Zettaweb?" required className={`${inputStyle} h-28 resize-none`} />
          </div>
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
        <p className="text-sm font-semibold">No testimonials found. Click 'Add New' to create one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-5 bg-black/20 hover:bg-white/5 border border-white/5 rounded-2xl transition-all duration-300 group">
          <div className="mb-4 sm:mb-0">
            <h4 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{item.name}</h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.role}</p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.feedback}</p>
          </div>
          <div className="flex gap-2.5 self-end sm:self-auto">
            <Button size="sm" onClick={() => onEdit(item)} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl px-4 py-1.5 transition-all flex items-center space-x-1">
              <LucideIcons.Edit size={14} />
              <span>Edit</span>
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete('testimonials', item.id)} className="font-semibold rounded-xl px-4 py-1.5 transition-all flex items-center space-x-1">
              <LucideIcons.Trash2 size={14} />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(TestimonialsManager);
