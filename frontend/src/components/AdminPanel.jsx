import React, { useState, useEffect, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';

const AdminPanel = () => {
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [techStack, setTechStack] = useState([]);
  const [aboutValues, setAboutValues] = useState([]);
  const [aboutTimeline, setAboutTimeline] = useState([]);
  
  const [activeTab, setActiveTab] = useState('projects');
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = useCallback(async (resource, setter) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/${resource}`);
    setter(await res.json());
  }, []);

  const loadAllData = useCallback(() => {
    fetchData('projects', setProjects);
    fetchData('testimonials', setTestimonials);
    fetchData('services', setServices);
    fetchData('techStack', setTechStack);
    fetchData('aboutValues', setAboutValues);
    fetchData('aboutTimeline', setAboutTimeline);
  }, [fetchData]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleDelete = async (resource, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/${resource}/${id}`, { method: 'DELETE' });
      loadAllData();
    }
  };

  const handleSave = async (e, resource) => {
    e.preventDefault();
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
        alert("Invalid JSON in technologies field!");
        return;
      }
    }

    const method = editingItem ? 'PUT' : 'POST';
    const url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/${resource}${editingItem ? `/${editingItem.id}` : ''}`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    setEditingItem(null);
    loadAllData();
  };

  return (
    <div className="container mx-auto px-4 py-20 lg:py-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
          Admin <span className="gradient-text glow-text">Dashboard</span>
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[
          { id: 'projects', label: 'Projects' },
          { id: 'testimonials', label: 'Testimonials' },
          { id: 'services', label: 'Services' },
          { id: 'techStack', label: 'Tech Stack' },
          { id: 'aboutValues', label: 'About Values' },
          { id: 'aboutTimeline', label: 'About Timeline' }
        ].map(tab => (
          <Button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setEditingItem(null); }}
            className={activeTab === tab.id ? 'bg-primary' : 'glass'}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <Card className="glass p-8 rounded-3xl border-muted/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold capitalize">{activeTab}</h3>
          {!editingItem && (
            <Button onClick={() => setEditingItem({})} className="bg-primary">
              Add New
            </Button>
          )}
        </div>

        {editingItem ? (
          <form onSubmit={(e) => handleSave(e, activeTab)} className="space-y-4">
            {activeTab === 'projects' && (
              <>
                <input name="title" defaultValue={editingItem.title} placeholder="Title" required className="w-full p-2 rounded glass" />
                <input name="category" defaultValue={editingItem.category} placeholder="Category" required className="w-full p-2 rounded glass" />
                <textarea name="description" defaultValue={editingItem.description} placeholder="Description" required className="w-full p-2 rounded glass h-24" />
                <input name="image" defaultValue={editingItem.image} placeholder="Image URL" required className="w-full p-2 rounded glass" />
                <input name="technologies" defaultValue={editingItem.technologies?.join(', ')} placeholder="Technologies (comma separated)" required className="w-full p-2 rounded glass" />
                <input name="demoLink" defaultValue={editingItem.demoLink} placeholder="Demo Link" className="w-full p-2 rounded glass" />
                <input name="githubLink" defaultValue={editingItem.githubLink} placeholder="GitHub Link" className="w-full p-2 rounded glass" />
              </>
            )}
            {activeTab === 'testimonials' && (
              <>
                <input name="name" defaultValue={editingItem.name} placeholder="Name" required className="w-full p-2 rounded glass" />
                <input name="role" defaultValue={editingItem.role} placeholder="Role" required className="w-full p-2 rounded glass" />
                <input name="avatar" defaultValue={editingItem.avatar} placeholder="Avatar Initials" required className="w-full p-2 rounded glass" />
                <input name="rating" type="number" min="1" max="5" defaultValue={editingItem.rating || 5} placeholder="Rating (1-5)" required className="w-full p-2 rounded glass" />
                <textarea name="feedback" defaultValue={editingItem.feedback} placeholder="Feedback" required className="w-full p-2 rounded glass h-24" />
              </>
            )}
            {activeTab === 'services' && (
              <>
                <input name="title" defaultValue={editingItem.title} placeholder="Title" required className="w-full p-2 rounded glass" />
                <input name="icon" defaultValue={editingItem.icon} placeholder="Lucide Icon Name (e.g. Globe)" required className="w-full p-2 rounded glass" />
                <textarea name="description" defaultValue={editingItem.description} placeholder="Description" required className="w-full p-2 rounded glass h-24" />
                <input name="technologies" defaultValue={editingItem.technologies?.join(', ')} placeholder="Technologies (comma separated)" required className="w-full p-2 rounded glass" />
                <input name="benefits" defaultValue={editingItem.benefits} placeholder="Benefits" required className="w-full p-2 rounded glass" />
              </>
            )}
            {activeTab === 'techStack' && (
              <>
                <input name="category" defaultValue={editingItem.category} placeholder="Category" required className="w-full p-2 rounded glass" />
                <textarea name="technologies" defaultValue={editingItem.technologies ? JSON.stringify(editingItem.technologies, null, 2) : '[\n  {\n    "name": "Tech",\n    "icon": "⚛️",\n    "description": "Desc",\n    "color": "border-primary/20"\n  }\n]'} placeholder="Technologies JSON Array" required className="w-full p-2 rounded glass h-48 font-mono text-sm" />
              </>
            )}
            {activeTab === 'aboutValues' && (
              <>
                <input name="title" defaultValue={editingItem.title} placeholder="Title" required className="w-full p-2 rounded glass" />
                <input name="icon" defaultValue={editingItem.icon} placeholder="Lucide Icon Name (e.g. Zap)" required className="w-full p-2 rounded glass" />
                <textarea name="description" defaultValue={editingItem.description} placeholder="Description" required className="w-full p-2 rounded glass h-24" />
                <input name="color" defaultValue={editingItem.color || 'text-primary'} placeholder="Text Color Class" required className="w-full p-2 rounded glass" />
                <input name="bgColor" defaultValue={editingItem.bgColor || 'bg-primary/10'} placeholder="Background Color Class" required className="w-full p-2 rounded glass" />
              </>
            )}
            {activeTab === 'aboutTimeline' && (
              <>
                <input name="year" defaultValue={editingItem.year} placeholder="Year" required className="w-full p-2 rounded glass" />
                <input name="event" defaultValue={editingItem.event} placeholder="Event Name" required className="w-full p-2 rounded glass" />
                <textarea name="description" defaultValue={editingItem.description} placeholder="Description" required className="w-full p-2 rounded glass h-24" />
              </>
            )}
            <div className="flex gap-4">
              <Button type="submit" className="bg-primary">Save</Button>
              <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div className="grid gap-4">
            {(() => {
              let currentData = [];
              if (activeTab === 'projects') currentData = projects;
              if (activeTab === 'testimonials') currentData = testimonials;
              if (activeTab === 'services') currentData = services;
              if (activeTab === 'techStack') currentData = techStack;
              if (activeTab === 'aboutValues') currentData = aboutValues;
              if (activeTab === 'aboutTimeline') currentData = aboutTimeline;

              return currentData.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 glass rounded-xl">
                  <div>
                    <h4 className="font-bold">
                      {item.title || item.name || item.category || item.year}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.category || item.role || item.event || item.description?.substring(0, 50)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setEditingItem(item)} className="glass">Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(activeTab, item.id)}>Delete</Button>
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminPanel;
