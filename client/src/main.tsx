import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from './layouts/MainLayout.tsx';
import HomePage from './routes/HomePage.tsx';
import Auth from './routes/Auth.tsx';
import Doc from './routes/Doc.tsx';
import SearchResult from './routes/SearchResult.tsx';
import UserDash from "./routes/Dashboards/userDash/UserDash.tsx";
import MyAppointment from './routes/Dashboards/userDash/MyAppointment.tsx';
import Profile from './routes/Dashboards/userDash/Profile.tsx';
import StaffDash from './routes/Dashboards/staffDash/StaffDash.tsx';
import Appointments from './routes/Dashboards/staffDash/Appointments.tsx';
import Patients from './routes/Dashboards/staffDash/Patients.tsx';
import WalkInAppointment from './routes/Dashboards/staffDash/WalkInAppointment.tsx';
import Billing from './routes/Dashboards/staffDash/Billing.tsx';
import PaymentTable from './routes/Dashboards/staffDash/PaymentTable.tsx';
import DoctorDash from './routes/Dashboards/DoctorDash/DoctorDash.tsx';
import DoctorAppointment from "./routes/Dashboards/DoctorDash/DoctorAppointment.tsx"
import AddTreatment from './routes/Dashboards/DoctorDash/AddTreatment.tsx';
import MyPerformance from './routes/Dashboards/DoctorDash/MyPerformance.tsx';
import AdminDash from './routes/Dashboards/adminDash/AdminDash.tsx';
import DoctorSetting from './routes/Dashboards/adminDash/DoctorSetting.tsx';
import UserSetting from './routes/Dashboards/adminDash/UserSetting.tsx';
import StaffSetting from './routes/Dashboards/adminDash/StaffSetting.tsx';
import Reports from './routes/Dashboards/adminDash/Reports.tsx';
import EditView from './routes/Dashboards/adminDash/EditView.tsx';
import Add from './components/dashComponents/adminDash/Add.tsx';
import EditViewDoctor from './routes/Dashboards/adminDash/EditViewDoctor.tsx';
import EditViewStaff from './routes/Dashboards/adminDash/EditViewStaff.tsx';
import DashLayout from './layouts/DashLayout.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import PublicRoute from './routes/PublicRoute.tsx';
import Register from './components/authComponents/Register.tsx';
import Login from './components/authComponents/Login.tsx';
import DocReg from './components/authComponents/DocReg.tsx';
import Bookappointment from './routes/Bookappointment.tsx';
import Sessions from './routes/Sessions.tsx';
import Clinic from './routes/Clinic.tsx';
import Doctors from './routes/Doctors.tsx';
import PatientDetails from './components/dashComponents/staffDash/PatientDetails.tsx';
import AppointmentComponent from './components/dashComponents/staffDash/AppointmentComponent.tsx';
import AboutPage from './routes/AboutPage.tsx';


const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/auth",
        element:
          <PublicRoute>
            <Auth />
          </PublicRoute>
      },
      {
        path: "/register",
        element:
          <PublicRoute>
            <Register />
          </PublicRoute>
      },
      {
        path: "/login",
        element:
          <PublicRoute>
            <Login />
          </PublicRoute>
      },
      {
        path: "/doc_reg",
        element:
          <PublicRoute>
            <DocReg />
          </PublicRoute>
      },
      {
        path: "/:slug",
        element: <Doc />
      },
      {
        path: "/clinic/:slug",
        element: <Clinic />
      },
      {
        path: "/search",
        element: <SearchResult />
      },
      {
        path:"/about/:section",
        element:<AboutPage/>
      },
      {
        path: "/book/:id",
        element:
          <ProtectedRoute allowedRoles={["user"]}>
            <Bookappointment />
          </ProtectedRoute>
      },
      {
        path: "/session/:id",
        element:
          <ProtectedRoute allowedRoles={["user"]}>
            <Sessions />
          </ProtectedRoute>
      },
      {
        path: "/doctors/:id",
        element:
          <ProtectedRoute allowedRoles={["user"]}>
            <Doctors />
          </ProtectedRoute>
      },
    ],
  },
  {
    element: <DashLayout />,
    children: [ 
      /* user routes */

      {
        path: "/user_dash",
        element:
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDash />
          </ProtectedRoute>
      },
      {
        path: "/my_appointment/:id",
        element:
          <ProtectedRoute allowedRoles={["user"]}>
            <MyAppointment />
          </ProtectedRoute>
      },
      {
        path: "/my_profile",
        element:
          <ProtectedRoute allowedRoles={["user" , "doctor", "admin"]}>
            <Profile />
          </ProtectedRoute>
      },


      /* staff routes */
      {
        path: "/staff_dash",
        element:
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffDash />
          </ProtectedRoute>
      },
      {
        path: "/appointments",
        element:
          <ProtectedRoute allowedRoles={["staff"]}>
            <AppointmentComponent />
          </ProtectedRoute>
      },
      {
        path: "/patients",
        element:
          <ProtectedRoute allowedRoles={["staff", "doctor"]}>
            <Patients />
          </ProtectedRoute>
      },
      {
      path: "/patients/:id",
      element:
      <ProtectedRoute allowedRoles={["staff", "doctor"]}>
        <PatientDetails data={undefined}/>
      </ProtectedRoute>
      },
  {
    path: "/walk_in_appointment",
    element:
      <ProtectedRoute allowedRoles={["staff"]}>
        <WalkInAppointment />
      </ProtectedRoute>
  },
  {
    path: "/payment_list",
    element:
      <ProtectedRoute allowedRoles={["staff"]}>
        <PaymentTable />
      </ProtectedRoute>
  },
  {
    path: "/billing/:id",
    element:
      <ProtectedRoute allowedRoles={["staff"]}>
        <Billing />
      </ProtectedRoute>
  },

  /* doctor routes */
  {
    path: "/doctor_dash",
    element:
      <ProtectedRoute allowedRoles={["doctor"]}>
        <DoctorDash />
      </ProtectedRoute>
  },
  {
    path: "/doctor_appointments",
    element:
      <ProtectedRoute allowedRoles={["doctor"]}>
        <DoctorAppointment />
      </ProtectedRoute>
  },
  {
    path: "/add_treatment/:id",
    element:
      <ProtectedRoute allowedRoles={["doctor"]}>
        <AddTreatment />
      </ProtectedRoute>
  },
  {
    path: "/my_performance",
    element:
      <ProtectedRoute allowedRoles={["doctor"]}>
        <MyPerformance />
      </ProtectedRoute>
  },

  /* admin routes */
  {
    path: "/admin_dash",
    element:
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDash />
      </ProtectedRoute>
  },
  {
    path: "/user_setting",
    element:
      <ProtectedRoute allowedRoles={["admin"]}>
        <UserSetting />
      </ProtectedRoute>
  },

  {
    path: "/staff_setting",
    element:
      <ProtectedRoute allowedRoles={["admin"]}>
        <StaffSetting />
      </ProtectedRoute>
  },
  {
    path: "/reports",
    element:
      <ProtectedRoute allowedRoles={["admin"]}>
        <Reports />
      </ProtectedRoute>
  },
  {
    path: "/view_edit/:id",
    element:
      <ProtectedRoute allowedRoles={["admin"]}>
        <EditView />
      </ProtectedRoute>
  },
  {
    path: "/add",
    element:
      <ProtectedRoute allowedRoles={["admin"]}>
        <Add />
      </ProtectedRoute>
  },
  /* admin doctor routes */
  {
    path: "/doctor_setting",
    element:
      <ProtectedRoute allowedRoles={["admin"]}>
        <DoctorSetting />
      </ProtectedRoute>
  },
  {
    path: "/view_edit_doctor/:id",
    element:
      <ProtectedRoute allowedRoles={["admin"]}>
        <EditViewDoctor />
      </ProtectedRoute>
  },
  /* admin staff routes */
  {
    path: "/view_edit_staff/:id",
    element:
      <ProtectedRoute allowedRoles={["admin"]}>
        <EditViewStaff />
      </ProtectedRoute>
  }
]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
