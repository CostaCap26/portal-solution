import {
    Outlet,
    NavLink,
    useParams,
    useNavigate,
    useLocation,
} from "react-router-dom";
import {
    Home,
    Settings,
    Database,
    Eye,
    BarChart3,
    Briefcase,
    LogOut,
    ChevronDown,
    Expand,
    Shrink
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState, useRef, useEffect } from "react";

export default function PortalLayout() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, logout } = useAuth();

    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    };
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Chiude dropdown cliccando fuori
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Esc gestito bene
    useEffect(() => {
        const handler = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handler);
        return () =>
            document.removeEventListener("fullscreenchange", handler);
    }, []);

    // Evidenzia parent se siamo in una sottopagina
    const isSystemActive =
        location.pathname.includes("permessi") ||
        location.pathname.includes("gestione-cache") ||
        location.pathname.includes("gestione-query") ||
        location.pathname.includes("gestione-dashboard");

    const isIngestionActive =
        location.pathname.includes("inserimento-dati") ||
        location.pathname.includes("import-file") ||
        location.pathname.includes("ingestion");

    const navClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2 ${isActive ? "text-blue-600 font-semibold" : "text-gray-700"
        } hover:text-blue-600`;

    const dropdownParentClass = (active: boolean) =>
        `flex items-center gap-2 ${active ? "text-blue-600 font-semibold" : "text-gray-700"
        } hover:text-blue-600`;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            <header className="bg-white shadow border-b">
                <div
                    ref={menuRef}
                    className="px-6 py-4 flex items-center justify-between"
                >
                    {/* SINISTRA TUTTA ALLINEATA */}
                    <div className="flex items-center gap-6 text-sm font-medium">

                        <NavLink
                            to={`/portal/${slug}`}
                            end
                            className={navClass}
                        >
                            <Home size={18} />
                            Home
                        </NavLink>

                        <div className="h-6 w-px bg-gray-300" />

                        {/* GESTIONE SISTEMA */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setOpenMenu(
                                        openMenu === "system"
                                            ? null
                                            : "system"
                                    )
                                }
                                className={dropdownParentClass(isSystemActive)}
                            >
                                <Settings size={18} />
                                Gestione Sistema
                                <ChevronDown size={16} />
                            </button>

                            {openMenu === "system" && (
                                <div className="absolute mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
                                    <NavLink
                                        to={`/portal/${slug}/permessi`}
                                        onClick={() => setOpenMenu(null)}
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        Permessi
                                    </NavLink>

                                    <NavLink
                                        to={`/portal/${slug}/gestione-cache`}
                                        onClick={() => setOpenMenu(null)}
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        Gestione Cache
                                    </NavLink>

                                    <NavLink
                                        to={`/portal/${slug}/gestione-query`}
                                        onClick={() => setOpenMenu(null)}
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        Gestione Query
                                    </NavLink>

                                    <NavLink
                                        to={`/portal/${slug}/gestione-dashboard`}
                                        onClick={() => setOpenMenu(null)}
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        Gestione Dashboard
                                    </NavLink>
                                </div>
                            )}
                        </div>

                        {/* DATA INGESTION */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setOpenMenu(
                                        openMenu === "ingestion"
                                            ? null
                                            : "ingestion"
                                    )
                                }
                                className={dropdownParentClass(isIngestionActive)}
                            >
                                <Database size={18} />
                                Data Ingestion
                                <ChevronDown size={16} />
                            </button>

                            {openMenu === "ingestion" && (
                                <div className="absolute mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
                                    <NavLink
                                        to={`/portal/${slug}/inserimento-dati`}
                                        onClick={() => setOpenMenu(null)}
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        Inserimento Dati
                                    </NavLink>

                                    <NavLink
                                        to={`/portal/${slug}/import-file`}
                                        onClick={() => setOpenMenu(null)}
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        Import File
                                    </NavLink>
                                </div>
                            )}
                        </div>

                        <NavLink
                            to={`/portal/${slug}/views/1`}
                            className={navClass}
                        >
                            <Eye size={18} />
                            Views
                        </NavLink>

                        <NavLink
                            to={`/portal/${slug}/dashboard`}
                            className={navClass}
                        >
                            <BarChart3 size={18} />
                            Dashboard
                        </NavLink>

                        <NavLink
                            to={`/portal/${slug}/job`}
                            className={navClass}
                        >
                            <Briefcase size={18} />
                            Job
                        </NavLink>
                    </div>

                    {/* DESTRA */}
                    <div className="flex items-center gap-4">

                        {/* FULLSCREEN BUTTON */}
                        <button
                            onClick={toggleFullscreen}
                            className={`flex items-center gap-2 text-sm font-medium ${isFullscreen ? "text-blue-600" : "text-gray-700"
                                } hover:text-blue-600`}
                        >
                            {isFullscreen ? <Shrink size={18} /> : <Expand size={18} />}
                            Fullscreen
                        </button>

                        <div className="h-6 w-px bg-gray-300" />

                        <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold">
                            {auth?.username?.charAt(0).toUpperCase()}
                        </div>

                        <span className="text-sm font-medium text-gray-700">
                            {auth?.username}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}