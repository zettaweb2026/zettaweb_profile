require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/webnexa';

async function migrate() {
  try {
    await mongoose.connect(URI);
    console.log('Connected to MongoDB');

    const dbData = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
    
    // Import Schemas
    const app = require('./server'); // This registers the schemas but we won't listen
    
    const collections = ['projects', 'testimonials', 'services', 'techStack', 'aboutValues', 'aboutTimeline'];
    
    for (const collection of collections) {
      if (dbData[collection] && dbData[collection].length > 0) {
        const Model = mongoose.models[collection.charAt(0).toUpperCase() + collection.slice(1).replace(/s$/, '')] || mongoose.model(collection);
        
        // Clear existing
        await Model.deleteMany({});
        
        // Insert many (removing string ids so mongoose generates ObjectId)
        const docs = dbData[collection].map(item => {
          const { id, ...rest } = item;
          return rest;
        });
        
        await Model.insertMany(docs);
        console.log(`Migrated ${docs.length} items to ${collection}`);
      }
    }
    
    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
