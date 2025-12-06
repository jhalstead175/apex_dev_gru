import Dashboard from './pages/Dashboard';
import QuoteGenerator from './pages/QuoteGenerator';
import CRM from './pages/CRM';
import ClientPortal from './pages/ClientPortal';
import Analytics from './pages/Analytics';
import Social from './pages/Social';
import Home from './pages/Home';
import Reports from './pages/Reports';
import SEO from './pages/SEO';
import AIAgents from './pages/AIAgents';
import ReferralLandingPage from './pages/ReferralLandingPage';
import ReferralPortal from './pages/ReferralPortal';
import AdminReferralDashboard from './pages/AdminReferralDashboard';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "QuoteGenerator": QuoteGenerator,
    "CRM": CRM,
    "ClientPortal": ClientPortal,
    "Analytics": Analytics,
    "Social": Social,
    "Home": Home,
    "Reports": Reports,
    "SEO": SEO,
    "AIAgents": AIAgents,
    "ReferralLandingPage": ReferralLandingPage,
    "ReferralPortal": ReferralPortal,
    "AdminReferralDashboard": AdminReferralDashboard,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};