import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminComingSoon } from "@/pages/admin/AdminComingSoon";
import { PageSkeleton } from "@/components/shared/AsyncStates";

// Home is eagerly loaded — it's the most common entry point and lazy-loading
// it would add a needless round trip to first paint. Everything else is
// split per route so the initial bundle stays small.
import Home from "@/pages/public/Home";

const About = lazy(() => import("@/pages/public/About"));
const Skills = lazy(() => import("@/pages/public/Skills"));
const Projects = lazy(() => import("@/pages/public/Projects"));
const ProjectDetail = lazy(() => import("@/pages/public/ProjectDetail"));
const Experience = lazy(() => import("@/pages/public/Experience"));
const Certifications = lazy(() => import("@/pages/public/Certifications"));
const SecurityLab = lazy(() => import("@/pages/public/SecurityLab"));
const SecurityWriteupDetail = lazy(() => import("@/pages/public/SecurityWriteupDetail"));
const Blog = lazy(() => import("@/pages/public/Blog"));
const BlogDetail = lazy(() => import("@/pages/public/BlogDetail"));
const Resume = lazy(() => import("@/pages/public/Resume"));
const Contact = lazy(() => import("@/pages/public/Contact"));
const Privacy = lazy(() => import("@/pages/public/Privacy"));
const NotFound = lazy(() => import("@/pages/public/NotFound"));

const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

function page(element: ReactNode) {
  return <Suspense fallback={<PageSkeleton />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: page(<NotFound />),
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: page(<About />) },
      { path: "/skills", element: page(<Skills />) },
      { path: "/projects", element: page(<Projects />) },
      { path: "/projects/:slug", element: page(<ProjectDetail />) },
      { path: "/experience", element: page(<Experience />) },
      { path: "/certifications", element: page(<Certifications />) },
      { path: "/security-lab", element: page(<SecurityLab />) },
      { path: "/security-lab/:slug", element: page(<SecurityWriteupDetail />) },
      { path: "/blog", element: page(<Blog />) },
      { path: "/blog/:slug", element: page(<BlogDetail />) },
      { path: "/resume", element: page(<Resume />) },
      { path: "/contact", element: page(<Contact />) },
      { path: "/privacy", element: page(<Privacy />) },
      { path: "*", element: page(<NotFound />) },
    ],
  },
  { path: "/admin/login", element: page(<AdminLogin />) },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: page(<AdminDashboard />) },
      { path: "projects", element: <AdminComingSoon title="Projects" /> },
      { path: "blog", element: <AdminComingSoon title="Blog" /> },
      { path: "security-lab", element: <AdminComingSoon title="Security Lab" /> },
      { path: "messages", element: <AdminComingSoon title="Messages" /> },
    ],
  },
]);
