import { defineCliConfig } from 'sanity/cli';
import dotenv from 'dotenv';

// Laster miljøvariabler fra .env filen
dotenv.config();

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID, 
    dataset: process.env.SANITY_STUDIO_DATASET, 
  },
  autoUpdates: true,
});
