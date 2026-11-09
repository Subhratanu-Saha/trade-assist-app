import { renderHook, act, waitFor } from "@testing-library/react";
import useAgentLogin from "./useAgentLogin";
import { saveUserSession } from "../utils/sessionStorage";

jest.mock("../utils/sessionStorage", () => ({
  saveUserSession: jest.fn(),
}));

describe("useAgentLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test("should have initial state", () => {
    const { result } = renderHook(() => useAgentLogin());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
    expect(result.current.data).toBeNull();
    expect(typeof result.current.login).toBe("function");
    expect(typeof result.current.clearError).toBe("function");
  });

  test("should login successfully", async () => {
    const mockResponse = {
      token: "abc123",
      message: "Login successful",
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const { result } = renderHook(() => useAgentLogin());

    let loginResult;

    await act(async () => {
      loginResult = await result.current.login(
        "test@example.com",
        "password123"
      );
    });

    expect(loginResult).toEqual(mockResponse);
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBe("");
    expect(result.current.loading).toBe(false);

    expect(saveUserSession).toHaveBeenCalledWith({
      email: "test@example.com",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/auth"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      }
    );
  });

  test("should set loading to true while login is processing", async () => {
    let resolveFetch;

    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    const { result } = renderHook(() => useAgentLogin());

    act(() => {
      result.current.login("test@example.com", "password123");
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveFetch({
        ok: true,
        json: jest.fn().mockResolvedValue({ token: "abc123" }),
      });
    });

    expect(result.current.loading).toBe(false);
  });

  test("should handle unsuccessful login with API error message", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        message: "Invalid credentials",
      }),
    });

    const { result } = renderHook(() => useAgentLogin());

    let loginResult;

    await act(async () => {
      loginResult = await result.current.login(
        "wrong@example.com",
        "wrongpassword"
      );
    });

    expect(loginResult).toBeNull();
    expect(result.current.error).toBe("Invalid credentials");
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(saveUserSession).not.toHaveBeenCalled();
  });

  test("should use default error when API response has no message", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });

    const { result } = renderHook(() => useAgentLogin());

    await act(async () => {
      await result.current.login("test@example.com", "wrong");
    });

    expect(result.current.error).toBe("Login failed.");
    expect(result.current.data).toBeNull();
  });

  test("should handle network errors", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useAgentLogin());

    let loginResult;

    await act(async () => {
      loginResult = await result.current.login(
        "test@example.com",
        "password123"
      );
    });

    expect(loginResult).toBeNull();
    expect(result.current.error).toBe("Network error");
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  test("should use fallback error when caught error has no message", async () => {
    global.fetch.mockRejectedValue({});

    const { result } = renderHook(() => useAgentLogin());

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    expect(result.current.error).toBe(
      "Something went wrong while logging in."
    );
    expect(result.current.data).toBeNull();
  });

  test("should handle null caught error", async () => {
    global.fetch.mockRejectedValue(null);

    const { result } = renderHook(() => useAgentLogin());

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    expect(result.current.error).toBe(
      "Something went wrong while logging in."
    );
  });

  test("should clear the error", async () => {
    global.fetch.mockRejectedValue(new Error("Login error"));

    const { result } = renderHook(() => useAgentLogin());

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    expect(result.current.error).toBe("Login error");

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe("");
  });

  test("should clear previous error when a new login starts", async () => {
    global.fetch
      .mockRejectedValueOnce(new Error("First error"))
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ token: "new-token" }),
      });

    const { result } = renderHook(() => useAgentLogin());

    await act(async () => {
      await result.current.login("test@example.com", "wrong");
    });

    expect(result.current.error).toBe("First error");

    await act(async () => {
      await result.current.login("test@example.com", "correct");
    });

    expect(result.current.error).toBe("");
    expect(result.current.data).toEqual({ token: "new-token" });
  });

  test("should use production API URL for non-localhost hostname", async () => {
    const originalLocation = window.location;

    delete window.location;

    window.location = {
      hostname: "example.com",
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ token: "abc123" }),
    });

    const { result } = renderHook(() => useAgentLogin());

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "https://trade-assist-api.onrender.com/api/v1/auth"
      ),
      expect.any(Object)
    );

    window.location = originalLocation;
  });
});