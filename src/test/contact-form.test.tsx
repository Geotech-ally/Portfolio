import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "@/pages/public/Contact";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function renderContact() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  render(
    <QueryClientProvider client={client}>
      <Contact />
    </QueryClientProvider>
  );
}

describe("contact form validation", () => {
  it("requires a valid name, email, subject and message", async () => {
    const user = userEvent.setup();
    renderContact();

    await user.type(screen.getByLabelText(/name/i), "A");
    await user.type(screen.getByLabelText(/email/i), "invalid");
    await user.type(screen.getByLabelText(/subject/i), "A");
    await user.type(screen.getByLabelText(/message/i), "Short");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/message is too short/i)).toBeInTheDocument();
  });
});
