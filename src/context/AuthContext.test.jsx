import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import Login from "../components/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider, useAuthContext } from "./AuthContext";

let checkRequests = 0;

const server = setupServer(
  http.get("*/auth/check", () => {
    checkRequests += 1;
    return HttpResponse.json({ authenticated: true, username: "ana" });
  }),
  http.post("*/auth/login", () =>
    HttpResponse.json({ username: "ana" })
  )
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  checkRequests = 0;
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

const AuthStatus = () => {
  const { authenticated, user } = useAuthContext();
  return <span>{authenticated ? `authenticated:${user.username}` : "anonymous"}</span>;
};

describe("centralized authentication", () => {
  it("checks the session once when rendering a protected route", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>Private area</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText("Private area")).toBeInTheDocument();
    expect(checkRequests).toBe(1);
  });

  it("updates the shared authentication context after login", async () => {
    server.use(
      http.get("*/auth/check", () =>
        HttpResponse.json({ authenticated: false, username: null })
      )
    );

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
          <AuthStatus />
        </AuthProvider>
      </MemoryRouter>
    );

    await screen.findByText("anonymous");
    fireEvent.change(screen.getByLabelText("Usuario"), {
      target: { value: "ana" },
    });
    fireEvent.change(screen.getByLabelText("Contrasena"), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: "INICIAR SESION" }));

    expect(await screen.findByText("authenticated:ana")).toBeInTheDocument();
  });
});
