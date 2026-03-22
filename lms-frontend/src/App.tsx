import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminInstructors from './pages/AdminManage/AdminInstructors';
import AdminStudents from './pages/AdminManage/AdminStudents';
import AdminDashboard from './pages/AdminManage/AdminDashboard';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/global.css';
setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>

        <Route exact path="/login">
          <Login />
        </Route>

        <Route exact path="/register">
          <Register />
        </Route>

        <Route exact path="/dashboard">
            <Dashboard />
          </Route>

        <Route exact path="/admin-dashboard">
            <AdminDashboard />
        </Route>
        
        <Route exact path="/admin-instructors">
          <AdminInstructors />
        </Route>

        <Route exact path="/">
          <Redirect to="/login" />
        </Route>

        <Route exact path="/admin-students">
          <AdminStudents />
        </Route>
        
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);


export default App;