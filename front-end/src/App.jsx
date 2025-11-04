import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import { BookingProvider } from './contexts/BookingContext';
import Home from './pages/home/Home';
import About from './pages/about/About';
import Services from './pages/home/services/Services';
import Navbar from './components/navbar/Navbar';
import Footer from "./components/footer/Footer";
import Ticket from "./pages/ticket/Ticket";
import Detail from "./pages/ticket/detail/Detail";
import Login from "./components/login/Login";
import Checkout from "./pages/ticket/checkout/Checkout";
import Invoice from "./pages/ticket/invoice/Invoice";
import GuestRoute from "./components/login/GuestRoute";
import ProtectedRoute from "./components/login/ProtectedRoute";
import Admin from "./components/admin/Admin";
import { AdminProtectedRoute } from "./components/admin/Admin";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <AuthProvider>
            <TripProvider>
                <BookingProvider>
                    <Router>
                        <main className="w-full flex flex-col bg-neutral-50 min-h-screen">
                            <Navbar />

                            <Routes>

                                {/* --- PUBLIC ROUTES (Accessible to everyone) --- */}
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/services" element={<Services />} />
                                <Route path="/bus-tickets" element={<Ticket />} />
                                <Route path="/bus-tickets/detail/:id" element={<Detail />} />

                                {/* --- GUEST ROUTES (Only for logged-out users) --- */}
                                <Route element={<GuestRoute />}>
                                    <Route path="/login" element={<Login />} />
                                </Route>

                                {/* --- PROTECTED ROUTES (Only for logged-in users) --- */}
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/bus-tickets/checkout" element={<Checkout />} />
                                    <Route path="/bus-tickets/payment" element={<Invoice />} />
                                </Route>

                                    <Route
                                        path="/admin"
                                        element={
                                            <AdminProtectedRoute>
                                                <Admin />
                                            </AdminProtectedRoute>
                                        }
                                    />
                                
                            </Routes>
                                        <ToastContainer position="top-right" autoClose={5000} />
                            <Footer />
                        </main>
                    </Router>
                </BookingProvider>
            </TripProvider>
        </AuthProvider>
    );
}



export default App