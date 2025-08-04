# Raytni - Missing Persons and Lost Items Platform

**Raytni** is a community-driven platform for finding missing persons, lost objects, and stray animals in Mauritania.

## Project Overview

This is a modern web application built with React, TypeScript, and Firebase, designed to help the Mauritanian community reunite with what matters most to them.

### Features

- 🔍 **Report Missing Items/Persons**: Easy-to-use forms for reporting missing persons, objects, and animals
- 🗺️ **Location-Based Search**: Browse reports by location throughout Mauritania
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌐 **Multilingual Support**: Available in French and Arabic
- 📸 **Image Upload**: Support for photos to help with identification
- ⚡ **Real-time Updates**: Powered by Firebase for instant synchronization

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Backend**: Firebase (Firestore, Storage)
- **Internationalization**: i18next for French/Arabic support
- **Maps**: Leaflet for location services
- **Deployment**: Docker, Nginx

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd raytni

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Production Deployment

### Quick Production Build

**For Linux/macOS:**
```bash
chmod +x build-prod.sh
./build-prod.sh
```

**For Windows:**
```cmd
build-prod.bat
```

### Manual Production Build

```bash
# Install dependencies
npm ci

# Run linting
npm run lint

# Build for production
npm run build

# Preview the build locally
npm run preview
```

### Environment Variables

Create a `.env.production` file based on `.env.example`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t raytni .
docker run -p 80:80 raytni
```

### Traditional Web Server Deployment

After building, deploy the `dist/` folder contents to any web server (Apache, Nginx, etc.).

**Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/raytni/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Production Checklist

- [ ] Set up Firebase project and configure environment variables
- [ ] Configure domain name and SSL certificate
- [ ] Set up monitoring and analytics
- [ ] Configure backup strategies for Firebase data
- [ ] Test all features in production environment
- [ ] Set up error tracking (e.g., Sentry)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build with linting for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is developed for the Mauritanian community to help reunite families and recover lost items.

---

**Built with ❤️ for the people of Mauritania**
