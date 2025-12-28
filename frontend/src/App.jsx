import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import ProfilePage from './pages/ProfilePage';
import CommunityPage from './pages/CommunityPage';

// Layout wrapper for pages with navbar and footer
function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="page-wrapper">
                {children}
            </main>
            <Footer />
        </>
    );
}

// Auth layout without navbar/footer
function AuthLayout({ children }) {
    return <>{children}</>;
}

// Dashboard layout without footer
function DashboardLayout({ children }) {
    return (
        <>
            {children}
        </>
    );
}

function App() {
    const location = useLocation();

    return (
        <div className="app-container">
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    {/* Public Pages with Navbar/Footer */}
                    <Route path="/" element={
                        <MainLayout>
                            <LandingPage />
                        </MainLayout>
                    } />

                    <Route path="/jobs" element={
                        <MainLayout>
                            <JobsPage />
                        </MainLayout>
                    } />

                    <Route path="/jobs/:jobId" element={
                        <MainLayout>
                            <JobDetailPage />
                        </MainLayout>
                    } />

                    <Route path="/community" element={
                        <MainLayout>
                            <CommunityPage />
                        </MainLayout>
                    } />

                    <Route path="/profile" element={
                        <MainLayout>
                            <ProfilePage />
                        </MainLayout>
                    } />

                    {/* Auth Pages - No navbar/footer */}
                    <Route path="/login" element={
                        <AuthLayout>
                            <LoginPage />
                        </AuthLayout>
                    } />

                    <Route path="/register" element={
                        <AuthLayout>
                            <RegisterPage />
                        </AuthLayout>
                    } />

                    {/* Dashboard - Custom layout */}
                    <Route path="/dashboard" element={
                        <DashboardLayout>
                            <DashboardPage />
                        </DashboardLayout>
                    } />

                    {/* 404 Page */}
                    <Route path="*" element={
                        <MainLayout>
                            <div style={{
                                minHeight: '60vh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                textAlign: 'center',
                                padding: '48px 24px'
                            }}>
                                <div style={{ fontSize: '6rem', marginBottom: '16px' }}>🔍</div>
                                <h1 style={{ marginBottom: '16px' }}>404</h1>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                                    Page not found
                                </p>
                                <a href="/" className="btn btn-primary">
                                    Go Home
                                </a>
                            </div>
                        </MainLayout>
                    } />
                </Routes>
            </AnimatePresence>
        </div>
    );
}

export default App;
