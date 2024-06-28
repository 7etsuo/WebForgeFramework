# WebForge Frontend Documentation

## Architecture Overview

The WebForge frontend is built using React, providing a responsive and interactive user interface for managing WebAssembly modules. It communicates with the backend via RESTful API calls and WebSocket connections for real-time updates.

## Key Components

1. **App Component** (`App.js`)
   - Main component that sets up routing and global state
   - Manages authentication state
   - Renders the Layout component and routes

2. **Layout Component** (`components/Layout.js`)
   - Provides the overall structure for the application
   - Includes navigation and authentication UI elements

3. **Home Component** (`components/Home.js`)
   - Dashboard for logged-in users
   - Displays available WebAssembly modules
   - Allows loading and running WebAssembly modules

4. **Login Component** (`components/Login.js`)
   - Handles user login
   - Manages login form state and submission

5. **Register Component** (`components/Register.js`)
   - Handles user registration
   - Manages registration form state and submission

6. **ModuleList Component** (`components/ModuleList.js`)
   - Displays a list of available WebAssembly modules
   - Provides functionality to upload new modules

7. **Authentication Service** (`services/authService.js`)
   - Handles API calls related to authentication
   - Manages JWT token storage and renewal

## State Management

The application uses React's built-in useState and useEffect hooks for local and shared state management.

## Routing

React Router is used for client-side routing. Main routes include:
- `/`: Home/Dashboard (protected)
- `/login`: Login page
- `/register`: Registration page
- `/modules`: WebAssembly module list (protected)

## API Integration

The frontend communicates with the backend using axios for HTTP requests. The `authService.js` file encapsulates all API calls related to authentication and WebAssembly module management.

## WebAssembly Integration

The Home component demonstrates how to load and run WebAssembly modules:
1. Fetch the WebAssembly module binary from the server
2. Instantiate the WebAssembly module
3. Execute exported functions from the module

## Styling

The application uses Tailwind CSS for styling, providing a responsive and modern UI design.

## Error Handling and Notifications

React-Toastify is used for displaying notifications and errors to the user.

## Security Considerations

1. JWT tokens are stored in localStorage
2. Sensitive operations are protected by authentication middleware
3. Input validation is performed on form submissions

## Environment Variables

Key environment variables:
- `REACT_APP_API_URL`: Backend API URL

## Running the Frontend

1. Install dependencies: `npm install`
2. Set up environment variables in `.env` file
3. Start the development server: `npm start`
4. Build for production: `npm run build`

## Testing

Jest and React Testing Library are set up for unit and integration testing. Run tests with `npm test`.

## Interacting with WebAssembly Modules

To interact with a WebAssembly module:

1. Load the module using the `loadModule` function in the Home component
2. Once loaded, the module's exported functions become available
3. Use the `runFunction` method to execute functions from the loaded module
4. Results are displayed in the UI

Example:
```javascript
const loadModule = async (moduleName) => {
   const moduleData = await authService.getWasmModule(moduleName);
   const { instance } = await WebAssembly.instantiate(moduleData);
   setSelectedModule(instance.exports);
};

const runFunction = (funcName) => {
   const result = selectedModule[funcName](param1, param2);
   setResult(`${funcName}(${param1}, ${param2}) = ${result}`);
};
```

This setup allows for dynamic loading and execution of WebAssembly modules, providing a flexible interface for interacting with various WebAssembly functions.

