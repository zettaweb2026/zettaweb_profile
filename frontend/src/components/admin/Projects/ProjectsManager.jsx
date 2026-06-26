import React from 'react';
import { Button } from '../../../components/ui/button';
import * as LucideIcons from 'lucide-react';

const inputStyle = "w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium text-sm";
const labelStyle = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2";

const ProjectsManager = ({
  items = [],
  loading,
  editingItem,
  onSave,
  onDelete,
  onEdit,
  onCancel,
  uploadingImage,
  uploadedImageUrl,
  setUploadedImageUrl,
  onImageUpload,
  currentUser
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-6 py-16 text-center text-muted-foreground">
        <LucideIcons.Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-semibold">Loading projects...</p>
      </div>
    );
  }

  if (editingItem) {
    return (
      <form onSubmit={(e) => onSave(e, 'projects')} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelStyle}>Project Title</label>
            <input name="title" defaultValue={editingItem.title} placeholder="e.g. Modern E-commerce Platform" required className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Category</label>
            <input name="category" defaultValue={editingItem.category} placeholder="e.g. Web Development" required className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Project Image</label>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-black/40 hover:bg-white/5 hover:border-primary/50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingImage ? (
                      <LucideIcons.Loader2 className="w-6 h-6 text-primary mb-2 animate-spin" />
                    ) : (
                      <LucideIcons.CloudUpload className="w-6 h-6 text-muted-foreground mb-2" />
                    )}
                    <p className="text-xs text-muted-foreground font-semibold">
                      {uploadingImage ? 'Uploading to Cloudinary...' : 'Click or drag to upload image'}
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={onImageUpload} disabled={uploadingImage} />
                </label>
              </div>
              <input name="image" value={uploadedImageUrl || ''} onChange={(e) => setUploadedImageUrl(e.target.value)} placeholder="e.g. /images/project1.jpg or generated URL" required className={inputStyle} />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Description</label>
            <textarea name="description" defaultValue={editingItem.description} placeholder="Describe the project goals, achievements, and impact..." required className={`${inputStyle} h-28 resize-none`} />
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Technologies Used (comma separated)</label>
            <input name="technologies" defaultValue={editingItem.technologies?.join(', ')} placeholder="e.g. React, Node.js, MongoDB, Tailwind" required className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Demo Link (Optional)</label>
            <input name="demoLink" defaultValue={editingItem.demoLink} placeholder="e.g. https://demo.zettaweb.in" className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>GitHub Link (Optional)</label>
            <input name="githubLink" defaultValue={editingItem.githubLink} placeholder="e.g. https://github.com/zettaweb/project" className={inputStyle} />
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
        <p className="text-sm font-semibold">No projects found. Click 'Add New' to create one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-5 bg-black/20 hover:bg-white/5 border border-white/5 rounded-2xl transition-all duration-300 group">
          <div className="mb-4 sm:mb-0">
            <h4 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{item.title}</h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.category || item.description}</p>
          </div>
          <div className="flex gap-2.5 self-end sm:self-auto">
            <Button size="sm" onClick={() => onEdit(item)} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl px-4 py-1.5 transition-all flex items-center space-x-1">
              <LucideIcons.Edit size={14} />
              <span>Edit</span>
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete('projects', item.id)} className="font-semibold rounded-xl px-4 py-1.5 transition-all flex items-center space-x-1">
              <LucideIcons.Trash2 size={14} />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ProjectsManager);
