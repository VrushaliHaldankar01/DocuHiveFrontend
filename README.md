<<<<<<< HEAD
# DocuHiveFrontend
=======
# installation
npm create vite@latest my-project --template react
cd my-project
npm install

# tailwind css

npm install -D tailwindcss @tailwindcss/vite   

# vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

# src/index.css
@import "tailwindcss";


# run the project
npm run dev
>>>>>>> 5d588e3 (login/signup UI)
