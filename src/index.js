import ReactDOM from 'react-dom/client';
import App from "./App";
import { AuthProvider } from './Authintication';
import {BrowserRouter} from 'react-router-dom';
import {DashbordProvider} from './DashbordAuthContext';
import { NotificationProvider } from './notificationAuthContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <DashbordProvider>
        <NotificationProvider>
        <App/>  
        </NotificationProvider>
      </DashbordProvider>
    </AuthProvider>
  </BrowserRouter>
);
