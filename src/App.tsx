import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { DataProvider } from '@/contexts/DataProvider';
import { MainLayout } from "@/components/layout/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Branches from "./pages/Branches";
import Groups from "./pages/Groups";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Parents from "./pages/Parents";
import Meals from "./pages/Meals";
import Vaccination from "./pages/Vaccination";
import Activities from "./pages/Activities";
import Warehouse from "./pages/Warehouse";
import Finance from "./pages/Finance";
import Sleep from "./pages/Sleep";
import Homework from "./pages/Homework";
import Complaints from "./pages/Complaints";
import QRCode from "./pages/QRCode";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CRMManagement from "./pages/CRMManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/students" element={<Students />} />
                <Route path="/teachers" element={<Teachers />} />

                <Route path="/meals" element={<Meals />} />
                <Route path="/vaccination" element={<Vaccination />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/warehouse" element={<Warehouse />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/sleep" element={<Sleep />} />
                <Route path="/homework" element={<Homework />} />
                <Route path="/complaints" element={<Complaints />} />
                <Route path="/qr-code" element={<QRCode />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/super-dashboard" element={<SuperAdminDashboard />} />
                <Route path="/crm-management" element={<CRMManagement />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
