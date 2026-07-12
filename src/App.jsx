import { useState, useMemo, useCallback, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { roomAPI } from "./api";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import Categories from "./components/Categories";
import FeaturedRooms from "./components/FeaturedRooms";
import CategoryRooms from "./components/CategoryRooms";
import PremiumSection from "./components/PremiumSection";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import RoomModal from "./components/RoomModal";
import AllRooms from "./components/AllRooms";
import ContactPage from "./components/ContactPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import UserDashboard from "./pages/UserDashboard";
import roomsData from "./data/rooms";
import "./App.css";

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState("home");
  const [modalRoom, setModalRoom] = useState(null);
  const [apiRooms, setApiRooms] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  const allRooms = apiRooms.length > 0 ? apiRooms : roomsData;

  useEffect(() => {
    roomAPI.getAll().then((res) => setApiRooms(res.data)).catch(() => {});
  }, []);

  const displayRooms = useMemo(() => {
    let result = allRooms;
    if (categoryFilter) result = result.filter((r) => (r.category || "") === categoryFilter);
    if (searchText.trim()) {
      const s = searchText.toLowerCase();
      result = result.filter((r) =>
        (r.title || "").toLowerCase().includes(s) ||
        (r.location || r.loc || "").toLowerCase().includes(s)
      );
    }
    return result;
  }, [categoryFilter, searchText, allRooms]);

  const refreshRooms = useCallback(() => {
    roomAPI.getAll().then((res) => setApiRooms(res.data)).catch(() => {});
  }, []);

  const handleViewDetails = useCallback((room) => setModalRoom(room), []);
  const handleExploreRooms = useCallback(() => { setCategoryFilter(null); setSearchText(""); setPage("rooms"); }, []);
  const handleListProperty = useCallback(() => { if (!user) setPage("login"); else alert("📋 Property listing coming soon!"); }, [user]);
  const handleCategoryClick = useCallback((cat) => { setCategoryFilter(cat); setPage("rooms"); }, []);

  const handleSearch = useCallback(({ location, budget }) => {
    setSearchText(location || "");
    if (budget !== "Any Price") {
      const [min, max] = budget.replace("$", "").split(" - ").map((s) => parseInt(s.replace("+", "")));
      let result = allRooms;
      if (location.trim()) {
        const s = location.toLowerCase();
        result = result.filter((r) =>
          (r.title || "").toLowerCase().includes(s) ||
          (r.location || r.loc || "").toLowerCase().includes(s)
        );
      }
      if (max) result = result.filter((r) => r.price >= min && r.price <= max);
      else result = result.filter((r) => r.price >= min);
      setCategoryFilter(null);
      setPage("rooms");
      if (result.length === 0) alert("😕 No rooms found.");
    } else {
      setCategoryFilter(null);
      setPage("rooms");
    }
  }, [allRooms]);

  const authSuccess = useCallback(() => setPage("home"), []);

  const goHome = useCallback(() => { setCategoryFilter(null); setSearchText(""); setPage("home"); refreshRooms(); }, [refreshRooms]);

  const renderPage = () => {
    if (loading) return <div className="page-loading">Loading...</div>;

    switch (page) {
      case "rooms":
        return (
          <AllRooms
            rooms={displayRooms}
            onViewDetails={handleViewDetails}
            onBack={goHome}
          />
        );
      case "contact":
        return <ContactPage onBack={goHome} />;
      case "login":
        return authMode === "login"
          ? <Login onSwitch={() => setAuthMode("register")} onSuccess={authSuccess} onClose={goHome} />
          : <Register onSwitch={() => setAuthMode("login")} onSuccess={authSuccess} onClose={goHome} />;
      case "admin":
        return <AdminPanel onBack={goHome} />;
      case "dashboard":
        return <UserDashboard onBack={goHome} />;
      default:
        return (
          <>
            <Hero onExploreRooms={handleExploreRooms} onListProperty={handleListProperty} />
            <SearchBar onSearch={handleSearch} />
            <Categories onCategoryClick={handleCategoryClick} />
            <FeaturedRooms rooms={allRooms.slice(0, 4)} onViewDetails={handleViewDetails} title="Featured Rooms" />
            <CategoryRooms rooms={allRooms} onViewDetails={handleViewDetails} />
            <PremiumSection rooms={allRooms} onViewDetails={handleViewDetails} />
            <HowItWorks />
            <Testimonials />
          </>
        );
    }
  };

  return (
    <>
      <Navbar
        onPageChange={(p) => {
          if (p === "login" && user) {
            setPage(user.role === "admin" ? "admin" : "dashboard");
            return;
          }
          if (p === "login" && !user) { setAuthMode("login"); setPage("login"); return; }
          if (p === "home") { goHome(); return; }
          setPage(p);
        }}
        activePage={page}
        user={user}
        onLogout={() => { localStorage.removeItem("token"); window.location.reload(); }}
      />
      {renderPage()}
      <Footer />
      {modalRoom && <RoomModal room={modalRoom} onClose={() => setModalRoom(null)} />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
