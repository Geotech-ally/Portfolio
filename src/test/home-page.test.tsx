import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Home from "@/pages/public/Home";

const mockProjects = [
  {
    id: "1",
    slug: "saas-analytics-dashboard",
    title: "SaaS Analytics Dashboard",
    short_description: "Analytics product for product and operations teams.",
    status: "completed",
    project_technologies: [{ technology: "React" }, { technology: "Supabase" }, { technology: "PostgreSQL" }],
  },
  {
    id: "2",
    slug: "siaya-community-digital-hub",
    title: "Siaya Community Digital Hub",
    short_description: "Community access platform for learning and information.",
    status: "completed",
    project_technologies: [{ technology: "TypeScript" }, { technology: "Node.js" }, { technology: "PostgreSQL" }],
  },
];

vi.mock("@/hooks/useProfile", () => ({
  useProfile: () => ({
    data: {
      full_name: "Geoffrey Akoo",
      short_bio: "I design and build modern web applications with security considered throughout the development lifecycle.",
      github_url: "https://github.com/example",
      linkedin_url: "https://www.linkedin.com/in/example",
      location: "Nakuru, Kenya",
      is_available: true,
    },
  }),
}));

vi.mock("@/hooks/usePageMetadata", () => ({
  usePageMetadata: () => undefined,
}));

vi.mock("@/services/projects.service", () => ({
  listPublishedProjects: vi.fn(() => Promise.resolve(mockProjects)),
}));

vi.mock("@/services/skills.service", () => ({
  listSkillCategories: vi.fn(() => Promise.resolve([])),
}));

describe("public home page", () => {
  it("positions Geoffrey Akoo as a full-stack web developer and cybersecurity analyst with clear portfolio CTAs", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/geoffrey akoo/i)).toBeInTheDocument();
    expect(screen.getByText(/full-stack web developer/i)).toBeInTheDocument();
    expect(screen.getByText(/cybersecurity analyst/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view projects/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact me/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view resume/i })).toBeInTheDocument();

    expect(await screen.findByText(/saas analytics dashboard/i)).toBeInTheDocument();
    expect(await screen.findByText(/siaya community digital hub/i)).toBeInTheDocument();
  });
});
