import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsListPage } from "./pages/ProductsListPage";
import { ArchivedProductsPage } from "./pages/ArchivedProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { DistributionPage } from "./pages/DistributionPage";
import { RulesListPage } from "./pages/RulesListPage";
import { JobsPage } from "./pages/JobsPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "products",
        element: <ProductsListPage />,
      },
      {
        path: "archived-products",
        element: <ArchivedProductsPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "distribution",
        element: <DistributionPage />,
      },
      {
        path: "rules",
        element: <RulesListPage />,
      },
      {
        path: "jobs",
        element: <JobsPage />,
      },
      {
        path: "integrations",
        element: <IntegrationsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
