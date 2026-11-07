
import { renderHook, act } from "@testing-library/react";
import useCustomerSearch from "./useCustomerSearch";

describe("useCustomerSearch", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should have initial state", () => {
    const { result } = renderHook(() => useCustomerSearch());

    expect(result.current.customer).toBeNull();
    expect(result.current.responseCode).toBeNull();
    expect(result.current.error).toBe("");
    expect(result.current.loading).toBe(false);
  });

  test("should find customer successfully", async () => {
    const customer = {
      id: "C001",
      name: "John",
      email: "john@example.com",
    };

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        data: [customer],
      }),
    });

    const { result } = renderHook(() => useCustomerSearch());

    await act(async () => {
      await result.current.searchCustomer("john@example.com");
    });

    expect(result.current.customer).toEqual(customer);
    expect(result.current.responseCode).toBe(200);
    expect(result.current.error).toBe("");
    expect(result.current.loading).toBe(false);
  });

  test("should set loading while searching", async () => {
    let resolveFetch;

    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    const { result } = renderHook(() => useCustomerSearch());

    act(() => {
      result.current.searchCustomer("loading@example.com");
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveFetch({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ data: [] }),
      });
    });

    expect(result.current.loading).toBe(false);
  });

  test("should return cached customer without making another API call", async () => {
    const customer = {
      id: "C002",
      name: "Alice",
      email: "alice@example.com",
    };

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        data: [customer],
      }),
    });

    const { result } = renderHook(() => useCustomerSearch());

    await act(async () => {
      await result.current.searchCustomer("alice@example.com");
    });

    expect(result.current.customer).toEqual(customer);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.searchCustomer("alice@example.com");
    });

    expect(result.current.customer).toEqual(customer);
    expect(result.current.responseCode).toBe(200);
    expect(result.current.error).toBe("");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("should use trimmed email as cache key", async () => {
    const customer = {
      id: "C003",
      name: "Bob",
    };

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        data: [customer],
      }),
    });

    const { result } = renderHook(() => useCustomerSearch());

    await act(async () => {
      await result.current.searchCustomer(" bob@example.com ");
    });

    await act(async () => {
      await result.current.searchCustomer(" bob@example.com ");
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("should handle API error using error field", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        error: "Invalid customer email",
      }),
    });

    const { result } = renderHook(() => useCustomerSearch());

    await act(async () => {
      await result.current.searchCustomer("invalid@example.com");
    });

    expect(result.current.customer).toBeNull();
    expect(result.current.responseCode).toBe(400);
    expect(result.current.error).toBe("Invalid customer email");
    expect(result.current.loading).toBe(false);
  });

  test("should handle API error using message field", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({
        message: "Unauthorized",
      }),
    });

    const { result } = renderHook(() => useCustomerSearch());

    await act(async () => {
      await result.current.searchCustomer("message-error@example.com");
    });

    expect(result.current.error).toBe("Unauthorized");
    expect(result.current.responseCode).toBe(401);
  });

  test("should use default error when API provides no error message", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({}),
    });

    const { result } = renderHook(() => useCustomerSearch());

    await act(async () => {
      await result.current.searchCustomer("default-error@example.com");
    });

    expect(result.current.error).toBe("Customer search failed.");
    expect(result.current.responseCode).toBe(500);
  });

  test("should handle null API error data", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue(null),
    });

    const { result } = renderHook(() => useCustomerSearch());

    await act(async () => {
      await result.current.searchCustomer("null-error@example.com");
    });

    expect(result.current.error).toBe("Customer search failed.");
  });

  test("should set response code to 404 when no customer is found", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        data: [],
      }),
    });

    const { result } = renderHook(() => useCustomerSearch());

    await act(async () => {
      await result.current.searchCustomer("missing@example.com");
    });

    expect(result.current.customer).toBeNull();
    expect(result.current.responseCode).toBe(404);
    expect(result.current.loading).toBe(false);
  });

  test("should cache a search with no customer found", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        data: [],
      }),
    });

    const { result } = renderHook(() => useCustomerSearch());

    await act(async () => {
      await result.current.searchCustomer("notfound@example.com");
    });

    expect(result.current.responseCode).toBe(404);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.searchCustomer("notfound@example.com");
    });

    expect(result.current.responseCode).toBe(404);
    expect(result.current.customer).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("should handle empty data", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        data: null,
      }),
    });

    const { result } = renderHook(() => useCustomerSearch());

    await act(async () => {
      await result.current.searchCustomer("empty@example.com");
    });

    expect(result.current.responseCode).toBe(404);
    expect(result.current.customer).toBeNull();
  });

  test("should handle network errors", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    global.fetch.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useCustomerSearch());

    await act(async () => {
      await result.current.searchCustomer("network@example.com");
    });

    expect(result.current.responseCode).toBe(500);
    expect(result.current.error).toBe(
      "Unable to connect to Customer Search API."
    );
    expect(result.current.loading).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
  });

  test("should prevent another request while one is in progress", async () => {
    let resolveFetch;

    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    const { result } = renderHook(() => useCustomerSearch());

    act(() => {
      result.current.searchCustomer("first@example.com");
    });

    await act(async () => {
      await result.current.searchCustomer("second@example.com");
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveFetch({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: [{ id: "C004", name: "First Customer" }],
        }),
      });
    });

    expect(result.current.customer.name).toBe("First Customer");
    expect(result.current.loading).toBe(false);
  });

  test("should encode email in API URL", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        data: [],
      }),
    });

    const { result } = renderHook(() => useCustomerSearch());

    await act(async () => {
      await result.current.searchCustomer("test+user@example.com");
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("email=test%2Buser%40example.com")
    );
  });

  test("should use production API URL for non-localhost hostname", async () => {
    const originalLocation = window.location;

    try {
      delete window.location;

      window.location = {
        ...originalLocation,
        hostname: "example.com",
      };

      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: [],
        }),
      });

      const { result } = renderHook(() => useCustomerSearch());

      await act(async () => {
        await result.current.searchCustomer("production@example.com");
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://trade-assist-api.onrender.com/api/v1/customers"
        )
      );
    } finally {
      window.location = originalLocation;
    }
  });
});
