import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Hub from "../pages/Hub";
import PortalHome from "../pages/PortalHome";

import Permessi from "../pages/Permessi";
import GestioneCache from "../pages/GestioneCache";
import GestioneQuery from "../pages/GestioneQuery";
import GestioneDashboard from "../pages/GestioneDashboard";
import InserimentoDati from "../pages/InserimentoDati";
import ImportFile from "../pages/ImportFile";
import Views from "../pages/Views";
import Dashboard from "../pages/Dashboard";
import Job from "../pages/Job";

import MainLayout from "../layout/MainLayout";
import PortalLayout from "../layout/PortalLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* LOGIN */}
                <Route path="/" element={<Login />} />

                {/* HUB */}
                <Route
                    path="/hub"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Hub />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* PORTAL ROOT */}
                <Route
                    path="/portal/:slug"
                    element={
                        <ProtectedRoute>
                            <PortalLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<PortalHome />} />

                    {/* Gestione Sistema */}
                    <Route path="permessi" element={<Permessi />} />
                    <Route path="gestione-cache" element={<GestioneCache />} />
                    <Route path="gestione-query" element={<GestioneQuery />} />
                    <Route path="gestione-dashboard" element={<GestioneDashboard />} />

                    {/* Data Ingestion */}
                    <Route path="inserimento-dati" element={<InserimentoDati />} />
                    <Route path="import-file" element={<ImportFile />} />

                    {/* Views */}
                    <Route path="views/:datasetId" element={<Views />} />

                    {/* Dashboard */}
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* Job */}
                    <Route path="job" element={<Job />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}
