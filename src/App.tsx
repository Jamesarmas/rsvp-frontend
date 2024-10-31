import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CreatePage from "./pages/CreatePage";
import EventDetail from "./pages/EventDetail";
import EmailInvite from "./pages/EmailInvite";
import EditEvent from "./pages/EditEvent";
import RsvpPage from "./pages/RsvpPage";

function App() {
  return (
    <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>}
                />
                <Route path="/create-event" element={<ProtectedRoute>
                  <CreatePage />
                </ProtectedRoute>}
                />
                <Route path="/event/:id" element={<EventDetail />} />
                <Route path="/email-invite/:eventId" element={< EmailInvite/>} />
                <Route path="/edit-event/:id" element={<EditEvent />} />
                <Route path="/event/:id/rsvp" element={<RsvpPage />} />
              </Routes>
            </Router>
          </AuthProvider>
  );
}

export default App;