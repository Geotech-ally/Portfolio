import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import About from "@/pages/public/About";

describe("public navigation", () => {
  it("shows the required six primary public tabs", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /skills/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /blog/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /security lab/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /experience/i })).not.toBeInTheDocument();
  });

  it("positions Geoffrey Akoo as a full-stack developer and cybersecurity analyst without placeholder copy", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(screen.getByText(/geoffrey akoo/i)).toBeInTheDocument();
    expect(screen.getAllByText(/full-stack developer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/cybersecurity analyst/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/TODO:/i)).not.toBeInTheDocument();
  });
});
