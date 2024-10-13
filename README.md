# Fullstack Note App

Fullstack Note App is a web application that allows users to create, modify, delete, and organize notes efficiently.

## Features

- **User Authentication**: Secure sign-up, login, and user session management.
- **CRUD Operations**: Create, read, update, and delete notes effortlessly.
- **Responsive Design**: Optimized for various screen sizes, including mobile and desktop.
- **Note Pinning**: Easily pin important notes to the top of the list for quick access.
- **Persistent Storage**: Notes are stored in a database, ensuring they are available whenever you log in.

## Tech Stack

### Frontend

- **React**: For building the user interface and managing the state of the application.
- **React Router**: For handling client-side routing and navigation.
- **Axios**: For making HTTP requests to the backend.
- **Tailwind CSS**: For styling and responsive design.

### Backend

- **Node.js**: JavaScript runtime environment for server-side logic.
- **Express**: Web framework for building APIs and handling requests.
- **Mongoose**: ODM for connecting to MongoDB and managing data models.
- **JWT (JSON Web Token)**: For secure authentication and authorization.

### Database

- **MongoDB**: NoSQL database for storing user data and notes.

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/fullstack-note-app.git
   cd fullstack-note-app
   ```
2. **Configuration du backend:**

   ## Accédez au backendrépertoire:

   ```bash
   cd backend
   ```

   ## Installer les dépendances:

   ```bash
   npm install
   ```

   ## Créez un .envfichier et ajoutez les variables suivantes ::

   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

   ## Démarrer le serveur backend ::

   ```bash
   npm run dev
   ```

3. **Configuration du frontend:**

   ## Accédez au frontendrépertoire:

   ```bash
   cd ../frontend
   ```

   ## Installer les dépendances :

   ```bash
   npm install
   ```

   ## Créez un .envfichier et ajoutez les variables suivantes :

   ```bash
   REACT_APP_API_URL=http://localhost:5000
   ```

   ## Démarrez l’application frontale :

   ```bash
   npm start
   ```
