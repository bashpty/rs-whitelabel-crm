import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import PortfolioControlCenter from './pages/PortfolioControlCenter.jsx'
import PropertyDetail from './pages/PropertyDetail.jsx'
import SpatialIngestion from './pages/SpatialIngestion.jsx'
import LeadIntentDashboard from './pages/LeadIntentDashboard.jsx'
import TransactionPipeline from './pages/TransactionPipeline.jsx'
import Settings from './pages/Settings.jsx'
import CampaignManagement from './pages/CampaignManagement.jsx'
import UsersRoles from './pages/UsersRoles.jsx'
import Tasks from './pages/Tasks.jsx'
import LeasingOccupancy from './pages/LeasingOccupancy.jsx'
import DocumentVault from './pages/DocumentVault.jsx'
import ProjectControl from './pages/ProjectControl.jsx'
import ViewingsMaintenance from './pages/ViewingsMaintenance.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/portafolio" replace />} />
        <Route path="portafolio" element={<PortfolioControlCenter />} />
        <Route path="propiedades/:id" element={<PropertyDetail />} />
        <Route path="ingestion-espacial" element={<SpatialIngestion />} />
        <Route path="prospectos" element={<LeadIntentDashboard />} />
        <Route path="transacciones" element={<TransactionPipeline />} />
        <Route path="campanas" element={<CampaignManagement />} />
        <Route path="tareas" element={<Tasks />} />
        <Route path="arrendamientos" element={<LeasingOccupancy />} />
        <Route path="documentos" element={<DocumentVault />} />
        <Route path="proyectos" element={<ProjectControl />} />
        <Route path="visitas" element={<ViewingsMaintenance />} />
        <Route path="usuarios" element={<UsersRoles />} />
        <Route path="configuracion" element={<Settings />} />
      </Route>
    </Routes>
  )
}
