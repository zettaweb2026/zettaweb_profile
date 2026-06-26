import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { clearAuthSession, getAuthHeaders, getStoredUser, parseApiResponse } from '../../lib/auth';
import * as LucideIcons from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [techStack, setTechStack] = useState([]);
  const [aboutValues, setAboutValues] = useState([]);
  const [aboutTimeline, setAboutTimeline] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [leads, setLeads] = useState([]);

  const isSuperAdmin = currentUser && currentUser.isSuperAdmin;
  
  const allTabs = [
    { id: 'projects', label: 'Projects', icon: 'Briefcase' },
    { id: 'testimonials', label: 'Testimonials', icon: 'MessageSquare' },
    { id: 'services', label: 'Services', icon: 'Cpu' },
    { id: 'techStack', label: 'Tech Stack', icon: 'Code' },
    { id: 'aboutValues', label: 'About Values', icon: 'Heart' },
    { id: 'aboutTimeline', label: 'About Timeline', icon: 'Calendar' },
    { id: 'leads', label: 'Client Record', icon: 'PhoneCall' },
    { id: 'admins', label: 'Admins', icon: 'Users' }
  ];

  // Filter allowed tabs based on permissions
  const allowedTabs = allTabs.filter(tab => {
    if (tab.id === 'admins') return isSuperAdmin;
    return isSuperAdmin || (currentUser?.permissions || []).includes(tab.id);
  });

  const [activeTab, setActiveTab] = useState('projects');
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  // Auto-redirect activeTab if not allowed
  useEffect(() => {
    if (allowedTabs.length > 0 && !allowedTabs.find(t => t.id === activeTab)) {
      setActiveTab(allowedTabs[0].id);
    }
  }, [allowedTabs, activeTab]);

  const handleUnauthorized = useCallback((message) => {
    setError(message || 'Access denied');

    if (message === 'Authentication required' || message === 'Invalid or expired token') {
      clearAuthSession();
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const fetchData = useCallback(async (resource, setter) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/${resource}`);
      if (res.ok) {
        setter(await res.json());
      }
    } catch (err) {
      console.error(`Failed to fetch ${resource}:`, err);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/clients`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setLeads(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    }
  }, []);

  const fetchAdmins = useCallback(async () => {
    if (!isSuperAdmin) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/users`, {
        headers: getAuthHeaders(),
      });
      const data = await parseApiResponse(res);
      if (data.users) {
        setAdmins(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch admins:', err);
      handleUnauthorized(err.message);
    }
  }, [isSuperAdmin, handleUnauthorized]);

  const loadAllData = useCallback(() => {
    fetchData('projects', setProjects);
    fetchData('testimonials', setTestimonials);
    fetchData('services', setServices);
    fetchData('techStack', setTechStack);
    fetchData('aboutValues', setAboutValues);
    fetchData('aboutTimeline', setAboutTimeline);
    fetchLeads();    // for  client records
    if (isSuperAdmin) {
      fetchAdmins();
    }
  }, [fetchData, fetchAdmins, fetchLeads, isSuperAdmin]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Sync selected permissions when editing item changes
  useEffect(() => {
    if (editingItem) {
      if (editingItem.id) {
        setSelectedPermissions(editingItem.permissions || []);
      } else {
        setSelectedPermissions(['projects', 'testimonials', 'services', 'techStack', 'aboutValues', 'aboutTimeline', 'leads']);
      }
    }
  }, [editingItem]);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/admin/login', { replace: true });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setUploadedImageUrl(data.url);
        setSuccess('Image uploaded successfully!');
      } else {
        setError(data.message || 'Image upload failed');
      }
    } catch (err) {
      setError('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSuccess('Processing CSV...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvData = event.target.result;
        // Robust CSV line parser handling quotes
        const parseCSVLine = (text) => {
          const re = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
          return text.split(re).map(col => col.replace(/^"|"$/g, '').trim());
        };

        const lines = csvData.split(/\r?\n/).filter(line => line.trim());
        if (lines.length < 2) {
          setError('CSV file is empty or missing data rows.');
          setSuccess('');
          return;
        }

        const headers = parseCSVLine(lines[0]);
        let addedCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const row = parseCSVLine(lines[i]);
          const newClient = { status: 'Not Received' };
          
          let hasData = false;
          headers.forEach((header, index) => {
            if (header) {
              const val = row[index] || '';
              const lowerHeader = header.toLowerCase();
              let keyName = header;
              
              if (lowerHeader.includes('company') || lowerHeader.includes('name')) keyName = 'companyName';
              else if (lowerHeader.includes('phone') || lowerHeader.includes('number')) keyName = 'phone';
              else if (lowerHeader.includes('email') || lowerHeader.includes('mail')) keyName = 'email';
              
              newClient[keyName] = val;
              if (val) hasData = true;
            }
          });

          if (!hasData) continue;
          
          // Ensure mandatory fields exist for the backend model
          if (!newClient.companyName) newClient.companyName = newClient.name || 'Unknown Company';
          if (!newClient.phone) newClient.phone = 'N/A';
          if (!newClient.email) newClient.email = 'unknown@example.com';

          try {
            await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/clients`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
              },
              body: JSON.stringify(newClient),
            });
            addedCount++;
          } catch (err) {
            console.error('Failed to add client:', err);
          }
        }

        setSuccess(`Successfully added ${addedCount} clients from CSV.`);
        loadAllData(); // Refresh the table
      } catch (err) {
        setError('Failed to parse CSV file.');
        setSuccess('');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input so same file can be uploaded again if needed
  };

  const handleDelete = async (resource, id) => {         //for deleting data
    if (window.confirm('Are you sure you want to delete this item?')) {
      setError('');
      setSuccess('');
      let url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/${resource}/${id}`;
      if (resource === 'admins') {
        url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/users/${id}`;
      } else if (resource === 'leads') {
        url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/clients/${id}`;
      }

      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        await parseApiResponse(response);
        setSuccess('Deleted successfully.');
        loadAllData();
      } catch (requestError) {
        handleUnauthorized(requestError.message);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      await parseApiResponse(response);
      loadAllData();
    } catch (requestError) {
      handleUnauthorized(requestError.message);
    }
  };

  const handleSave = async (e, resource) => {   //for savving / adding data
    e.preventDefault();
    setError('');
    setSuccess('');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (resource === 'projects' && data.technologies && typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map(t => t.trim());
    }
    if (resource === 'services' && data.technologies && typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map(t => t.trim());
    }
    if (resource === 'techStack' && data.technologies) {
      try {
        data.technologies = JSON.parse(data.technologies);
      } catch (e) {
        setError("Invalid JSON in technologies field!");
        return;
      }
    }

    let method = editingItem && editingItem.id ? 'PUT' : 'POST';
    let url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/${resource}${editingItem && editingItem.id ? `/${editingItem.id}` : ''}`;

    if (resource === 'leads') {
      url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/clients${editingItem && editingItem.id ? `/${editingItem.id}` : ''}`;
    } else if (resource === 'admins') {
      data.permissions = selectedPermissions;
      if (editingItem && editingItem.id) {
        method = 'PUT';
        url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/users/${editingItem.id}`;
        if (!data.password) {
          delete data.password;
        }
      } else {
        method = 'POST';
        url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register`;
      }
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });

      await parseApiResponse(response);
      setSuccess(editingItem && editingItem.id ? 'Saved changes successfully.' : 'Created successfully.');
      setEditingItem(null);
      loadAllData();
    } catch (requestError) {
      handleUnauthorized(requestError.message);
    }
  };

  const inputStyle = "w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium text-sm";
  const labelStyle = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2";

  return (
    <div className="relative min-h-screen bg-background text-foreground py-20 lg:py-32 overflow-hidden px-4">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 leading-tight tracking-tight">
              Admin <span className="gradient-text glow-text">Dashboard</span>
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              Signed in as <span className="text-white font-semibold">{currentUser?.name}</span> ({currentUser?.role})
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="border-white/10 text-white hover:bg-white/5 hover:text-white rounded-xl px-5 py-2.5 flex items-center space-x-2 transition-all font-semibold"
          >
            <LucideIcons.LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Projects', value: projects.length, icon: 'Briefcase', color: 'text-primary' },
            { label: 'Active Services', value: services.length, icon: 'Cpu', color: 'text-secondary' },
            { label: 'Client Testimonials', value: testimonials.length, icon: 'MessageSquare', color: 'text-emerald-400' },
            isSuperAdmin && { label: 'Admin Accounts', value: admins.length, icon: 'Users', color: 'text-purple-400' }
          ].filter(Boolean).map((stat, idx) => {
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
                    <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tabs Control bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 p-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
          {allowedTabs.map(tab => {
            const TabIcon = LucideIcons[tab.icon] || LucideIcons.Folder;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { 
                  setActiveTab(tab.id); 
                  setEditingItem(null); 
                  setUploadedImageUrl('');
                  setError(''); 
                  setSuccess(''); 
                }}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                <TabIcon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center space-x-2 animate-pulse">
            <LucideIcons.AlertTriangle size={18} />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400 flex items-center space-x-2">
            <LucideIcons.CheckCircle size={18} />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Main Content Area */}
        <Card className="glass-card border-white/5 p-8 rounded-3xl relative overflow-hidden backdrop-blur-lg">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 border-b border-white/5 pb-6 gap-4">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center space-x-2">
                {(() => {
                  const active = allTabs.find(t => t.id === activeTab);
                  const Icon = active ? LucideIcons[active.icon] : null;
                  return (
                    <>
                      {Icon && <Icon className="text-primary mr-1" size={24} />}
                      <span>
                        {editingItem 
                          ? (editingItem.id ? `Edit ${active?.label}` : `Add New ${active?.label}`) 
                          : active?.label
                        }
                      </span>
                    </>
                  );
                })()}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {editingItem 
                  ? 'Fill out the form controls below to commit data modifications.' 
                  : `List of all registered ${activeTab} content entries.`
                }
              </p>
            </div>
            {!editingItem && (
              <div className="flex items-center space-x-3">
                {activeTab === 'leads' && (
                  <>
                    <Button
                      onClick={fetchLeads}
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5 flex items-center space-x-1.5 px-5 py-2.5 rounded-xl transition-all font-semibold"
                    >
                      <LucideIcons.RefreshCw size={16} />
                      <span>Refresh</span>
                    </Button>
                    <label className="cursor-pointer border border-white/10 text-white hover:bg-white/5 flex items-center space-x-1.5 px-5 py-2.5 rounded-xl transition-all font-semibold text-sm">
                      <LucideIcons.Upload size={16} />
                      <span>Upload CSV</span>
                      <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
                    </label>
                  </>
                )}
                <Button 
                  onClick={() => { setEditingItem({}); setUploadedImageUrl(''); }} 
                  className="bg-primary hover:bg-primary/95 text-white flex items-center space-x-1.5 px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/10 hover:scale-[1.02] font-semibold"
                >
                  <LucideIcons.Plus size={16} />
                  <span>Add New</span>
                </Button>
              </div>
            )}
          </div>

          {editingItem ? (
            <form onSubmit={(e) => handleSave(e, activeTab)} className="space-y-6">
              {activeTab === 'projects' && (
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
                              {uploadingImage ? "Uploading to Cloudinary..." : "Click or drag to upload image"}
                               <p className="text-xs text-muted-foreground">Max Img Size - 10MB</p>
                            </p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
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
              )}

              {activeTab === 'testimonials' && (
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
              )}

              {activeTab === 'services' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className={labelStyle}>Service Title</label>
                    <input name="title" defaultValue={editingItem.title} placeholder="e.g. Cloud Architecture" required className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Lucide Icon Name</label>
                    <input name="icon" defaultValue={editingItem.icon} placeholder="e.g. Cloud, Shield, Database, Layout" required className={inputStyle} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>Description</label>
                    <textarea name="description" defaultValue={editingItem.description} placeholder="Short summary of what this service offers..." required className={`${inputStyle} h-28 resize-none`} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>Technologies Used (comma separated)</label>
                    <input name="technologies" defaultValue={editingItem.technologies?.join(', ')} placeholder="e.g. AWS, Docker, Kubernetes" required className={inputStyle} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>Core Benefits / Details</label>
                    <input name="benefits" defaultValue={editingItem.benefits} placeholder="e.g. 99.9% Uptime, High Scalability, Cost Optimization" required className={inputStyle} />
                  </div>
                </div>
              )}

              {activeTab === 'techStack' && (
                <div className="grid gap-6">
                  <div>
                    <label className={labelStyle}>Category Name</label>
                    <input name="category" defaultValue={editingItem.category} placeholder="e.g. Frontend Technologies" required className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Technologies (JSON Array Format)</label>
                    <textarea name="technologies" defaultValue={editingItem.technologies ? JSON.stringify(editingItem.technologies, null, 2) : '[\n  {\n    "name": "React.js",\n    "icon": "⚛️",\n    "description": "Component-based UI architecture",\n    "color": "border-primary/20"\n  }\n]'} placeholder="JSON array" required className={`${inputStyle} h-60 font-mono text-xs`} />
                  </div>
                </div>
              )}

              {activeTab === 'aboutValues' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className={labelStyle}>Value Title</label>
                    <input name="title" defaultValue={editingItem.title} placeholder="e.g. Integrity First" required className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Lucide Icon Name</label>
                    <input name="icon" defaultValue={editingItem.icon} placeholder="e.g. Heart, Zap, Sparkles" required className={inputStyle} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>Description</label>
                    <textarea name="description" defaultValue={editingItem.description} placeholder="Explain what this value means to Zettaweb..." required className={`${inputStyle} h-28 resize-none`} />
                  </div>
                  <div>
                    <label className={labelStyle}>Text Color Class (Tailwind)</label>
                    <input name="color" defaultValue={editingItem.color || 'text-primary'} placeholder="e.g. text-primary" required className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Bg Color Class (Tailwind)</label>
                    <input name="bgColor" defaultValue={editingItem.bgColor || 'bg-primary/10'} placeholder="e.g. bg-primary/10" required className={inputStyle} />
                  </div>
                </div>
              )}

              {activeTab === 'aboutTimeline' && (
                <div className="grid gap-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <label className={labelStyle}>Year</label>
                      <input name="year" defaultValue={editingItem.year} placeholder="e.g. 2026" required className={inputStyle} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelStyle}>Event Name</label>
                      <input name="event" defaultValue={editingItem.event} placeholder="e.g. Platform Launch" required className={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className={labelStyle}>Event Description</label>
                    <textarea name="description" defaultValue={editingItem.description} placeholder="Describe what happened during this milestone..." required className={`${inputStyle} h-28 resize-none`} />
                  </div>
                </div>
              )}

              {activeTab === 'leads' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="md:col-span-2 p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary">
                    <p className="font-semibold flex items-center gap-2 mb-1">
                      <LucideIcons.CheckCircle size={16} /> Firebase Integration Active
                    </p>
                    <p className="text-primary/80">This form correctly uses the Firebase backend (/api/clients) to securely store Client Records.</p>
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
              )}

              {activeTab === 'admins' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className={labelStyle}>Admin Full Name</label>
                    <input name="name" defaultValue={editingItem.name || ''} placeholder="Full Name" required className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Email Address</label>
                    <input name="email" defaultValue={editingItem.email || ''} type="email" placeholder="Email Address" required className={inputStyle} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>{editingItem.id ? "Password (leave blank to keep current)" : "Password"}</label>
                    <input name="password" type="password" placeholder={editingItem.id ? "••••••••" : "Password (at least 6 characters)"} minLength="6" required={!editingItem.id} className={inputStyle} />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2 mt-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Work Types & Permission Scope:</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { id: 'projects', label: 'Projects' },
                        { id: 'testimonials', label: 'Testimonials' },
                        { id: 'services', label: 'Services' },
                        { id: 'techStack', label: 'Tech Stack' },
                        { id: 'aboutValues', label: 'About Values' },
                        { id: 'aboutTimeline', label: 'About Timeline' },
                        { id: 'leads', label: 'Client Record' }
                      ].map(perm => (
                        <label key={perm.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-white/5 hover:border-white/10 bg-black/20 hover:bg-white/5 transition-all select-none">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(perm.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPermissions([...selectedPermissions, perm.id]);
                              } else {
                                setSelectedPermissions(selectedPermissions.filter(p => p !== perm.id));
                              }
                            }}
                            className="rounded border-white/20 text-primary focus:ring-primary/50 bg-black/20 w-4 h-4 cursor-pointer"
                          />
                          <span className="text-sm font-semibold text-white">{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t border-white/5 mt-8">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-1.5 transition-all">
                  <LucideIcons.Save size={16} />
                  <span>Save Record</span>
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)} className="border-white/10 text-white hover:bg-white/5 px-6 py-2.5 rounded-xl font-semibold transition-all">
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {(() => {
                let currentData = [];
                if (activeTab === 'projects') currentData = projects;
                if (activeTab === 'testimonials') currentData = testimonials;
                if (activeTab === 'services') currentData = services;
                if (activeTab === 'techStack') currentData = techStack;
                if (activeTab === 'aboutValues') currentData = aboutValues;
                if (activeTab === 'aboutTimeline') currentData = aboutTimeline;
                if (activeTab === 'leads') currentData = leads;
                if (activeTab === 'admins') currentData = admins;

                if (currentData.length === 0) {
                  return (
                    <div className="text-center py-16 text-muted-foreground border border-dashed border-white/10 rounded-2xl bg-black/10">
                      <LucideIcons.Inbox size={48} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-semibold">No records found. Click 'Add New' to create one.</p>
                    </div>
                  );
                }

                if (activeTab === 'leads') {
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
                          {currentData.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-medium text-white">{item.companyName}</td>
                              <td className="px-6 py-4">{item.phone}</td>
                              <td className="px-6 py-4">{item.email}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1.5">
                                  {['Not Received', 'Received Call', 'In Progress', 'Closed'].map((s) => (
                                    <button
                                      key={s}
                                      onClick={() => handleStatusChange(item.id, s)}
                                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                        (item.status === s || (!item.status && s === 'Not Received'))
                                          ? (s === 'Received Call' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                            : s === 'Closed' ? 'bg-primary/20 text-primary border border-primary/30' 
                                            : s === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                                            : 'bg-destructive/20 text-destructive border border-destructive/30')
                                          : 'bg-black/40 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/5'
                                      }`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button size="sm" onClick={() => setEditingItem(item)} className="bg-white/5 hover:bg-white/10 text-white rounded-lg px-3 py-1 transition-all">
                                    <LucideIcons.Edit size={14} />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleDelete(activeTab, item.id)} className="rounded-lg px-3 py-1 transition-all">
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
                }

                return currentData.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-5 bg-black/20 hover:bg-white/5 border border-white/5 rounded-2xl transition-all duration-300 group">
                    <div className="mb-4 sm:mb-0">
                      <h4 className="font-bold text-white text-lg group-hover:text-primary transition-colors">
                        {item.title || item.name || item.category || item.year}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {activeTab === 'admins'
                          ? `Email: ${item.email}`
                          : (item.category || item.role || item.event || item.description)}
                      </p>
                      {activeTab === 'admins' && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.isSuperAdmin ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 text-yellow-400">
                              Super Admin
                            </span>
                          ) : (
                            (item.permissions || []).map(p => (
                              <span key={p} className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-primary/10 border border-primary/10 text-primary uppercase tracking-wider font-mono">
                                {p}
                              </span>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2.5 self-end sm:self-auto">
                      {(activeTab !== 'admins' || !item.isSuperAdmin) && (
                        <Button 
                          size="sm" 
                          onClick={() => { setEditingItem(item); setUploadedImageUrl(item.image || item.avatar || ''); }} 
                          className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl px-4 py-1.5 transition-all flex items-center space-x-1"
                        >
                          <LucideIcons.Edit size={14} />
                          <span>Edit</span>
                        </Button>
                      )}
                      {!(activeTab === 'admins' && item.isSuperAdmin) && (
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDelete(activeTab, item.id)}
                          className="font-semibold rounded-xl px-4 py-1.5 transition-all flex items-center space-x-1"
                        >
                          <LucideIcons.Trash2 size={14} />
                          <span>Delete</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
