import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import Purchase, {
  getPurchaseApiBaseUrl,
  fetchPurchaseData,
  purchaseRequests,
} from "./purchase";

const currentYear = new Date().getFullYear();

const mockPurchase = {
  purchaseid: "P001",
  productitem: "Laptop",
  transactionid: "T001",
  purchasedt: `${currentYear}-05-10`,
};

const mockFetchResponse = (data, ok = true, status = 200) => {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
};

beforeEach(() => {
  global.fetch = jest.fn();
  purchaseRequests.clear();
});

afterEach(() => {
  cleanup();
  purchaseRequests.clear();
  jest.clearAllMocks();
});

describe("getPurchaseApiBaseUrl", () => {
  test("returns localhost URL for localhost", () => {
    expect(getPurchaseApiBaseUrl("localhost")).toBe(
      "http://localhost:5000"
    );
  });

  test("returns production URL for other hostnames", () => {
    expect(getPurchaseApiBaseUrl("example.com")).toBe(
      "https://trade-assist-api.onrender.com"
    );
  });
});

describe("fetchPurchaseData", () => {
  test("fetches purchase data successfully", async () => {
    global.fetch.mockReturnValue(
      mockFetchResponse({ data: [mockPurchase] })
    );

    const result = await fetchPurchaseData("C001");

    expect(result).toEqual({ data: [mockPurchase] });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/purchase?customerId=C001")
    );
    expect(purchaseRequests.has("C001")).toBe(false);
  });

  test("encodes the customer ID in the request URL", async () => {
    global.fetch.mockReturnValue(mockFetchResponse([]));

    await fetchPurchaseData("C 001&test");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("customerId=C%20001%26test")
    );
  });

  test("returns an existing request instead of making another fetch", async () => {
    let resolveFetch;

    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    const firstRequest = fetchPurchaseData("C002");
    const secondRequest = fetchPurchaseData("C002");

    expect(firstRequest).toBe(secondRequest);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    resolveFetch({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await firstRequest;
  });

  test("throws an error when the API response is not successful", async () => {
    global.fetch.mockReturnValue(
      mockFetchResponse({}, false, 500)
    );

    await expect(fetchPurchaseData("C003")).rejects.toThrow(
      "Purchase API failed: 500"
    );

    expect(purchaseRequests.has("C003")).toBe(false);
  });

  test("does not delete a different cached request in finally", async () => {
    let resolveFetch;

    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    const originalRequest = fetchPurchaseData("C004");
    const replacementRequest = Promise.resolve("replacement");

    purchaseRequests.set("C004", replacementRequest);

    resolveFetch({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await originalRequest;

    expect(purchaseRequests.get("C004")).toBe(replacementRequest);

    purchaseRequests.delete("C004");
  });
});

describe("Purchase component", () => {
  test("displays the Purchase Details heading", () => {
    render(<Purchase customerId="C100" />);

    expect(screen.getByText("Purchase Details")).toBeInTheDocument();
  });

  test("displays loading message initially", () => {
    global.fetch.mockReturnValue(new Promise(() => {}));

    render(<Purchase customerId="C101" />);

    expect(
      screen.getByText("Loading purchase details...")
    ).toBeInTheDocument();
  });

  test("displays error when customer ID is missing", async () => {
    render(<Purchase customerId="" />);

    expect(
      await screen.findByText("Customer ID not found.")
    ).toBeInTheDocument();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("displays error when customer ID is undefined", async () => {
    render(<Purchase />);

    expect(
      await screen.findByText("Customer ID not found.")
    ).toBeInTheDocument();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("displays purchase records from result.data array", async () => {
    global.fetch.mockReturnValue(
      mockFetchResponse({ data: [mockPurchase] })
    );

    render(<Purchase customerId="C102" />);

    expect(await screen.findByText("P001")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("T001")).toBeInTheDocument();
  });

  test("displays purchase records when API returns a direct array", async () => {
    global.fetch.mockReturnValue(
      mockFetchResponse([mockPurchase])
    );

    render(<Purchase customerId="C103" />);

    expect(await screen.findByText("P001")).toBeInTheDocument();
  });

  test("displays purchase record when API returns a single object", async () => {
    global.fetch.mockReturnValue(
      mockFetchResponse({ data: mockPurchase })
    );

    render(<Purchase customerId="C104" />);

    expect(await screen.findByText("P001")).toBeInTheDocument();
  });

  test("displays empty message when API returns an empty array", async () => {
    global.fetch.mockReturnValue(mockFetchResponse({ data: [] }));

    render(<Purchase customerId="C105" />);

    expect(
      await screen.findByText(
        "You don't have any purchase record created this year"
      )
    ).toBeInTheDocument();
  });

  test("displays empty message when API returns null", async () => {
    global.fetch.mockReturnValue(mockFetchResponse(null));

    render(<Purchase customerId="C106" />);

    expect(
      await screen.findByText(
        "You don't have any purchase record created this year"
      )
    ).toBeInTheDocument();
  });

  test("displays empty message when API data is not an array or object", async () => {
    global.fetch.mockReturnValue(
      mockFetchResponse({ data: "invalid data" })
    );

    render(<Purchase customerId="C107" />);

    expect(
      await screen.findByText(
        "You don't have any purchase record created this year"
      )
    ).toBeInTheDocument();
  });

  test("displays error when API returns an unsuccessful response", async () => {
    global.fetch.mockReturnValue(
      mockFetchResponse({}, false, 500)
    );

    render(<Purchase customerId="C108" />);

    expect(
      await screen.findByText("Unable to load purchase details.")
    ).toBeInTheDocument();
  });

  test("displays error when fetch rejects", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    render(<Purchase customerId="C109" />);

    expect(
      await screen.findByText("Unable to load purchase details.")
    ).toBeInTheDocument();
  });

  test("uses camelCase purchase field names", async () => {
    const purchase = {
      purchaseId: "P002",
      productItem: "Mobile",
      transactionId: "T002",
      purchaseDt: `${currentYear}-06-15`,
    };

    global.fetch.mockReturnValue(
      mockFetchResponse({ data: [purchase] })
    );

    render(<Purchase customerId="C110" />);

    expect(await screen.findByText("P002")).toBeInTheDocument();
    expect(screen.getByText("Mobile")).toBeInTheDocument();
    expect(screen.getByText("T002")).toBeInTheDocument();
  });

  test("displays dash for missing purchase values", async () => {
    const purchase = {
      purchasedt: `${currentYear}-05-10`,
    };

    global.fetch.mockReturnValue(
      mockFetchResponse({ data: [purchase] })
    );

    render(<Purchase customerId="C111" />);

    await waitFor(() => {
      expect(screen.getAllByText("-")).toHaveLength(3);
    });
  });

  test("displays dash for null and empty purchase values", async () => {
    const purchase = {
      purchaseid: null,
      purchaseId: "",
      productitem: null,
      productItem: "",
      transactionid: null,
      transactionId: "",
      purchasedt: `${currentYear}-05-10`,
    };

    global.fetch.mockReturnValue(
      mockFetchResponse({ data: [purchase] })
    );

    render(<Purchase customerId="C112" />);

    await waitFor(() => {
      expect(screen.getAllByText("-")).toHaveLength(3);
    });
  });

  test("formats object values as JSON strings", async () => {
    const purchase = {
      purchaseid: { id: 1 },
      productitem: ["Laptop", "Mouse"],
      transactionid: { transaction: "T003" },
      purchasedt: `${currentYear}-05-10`,
    };

    global.fetch.mockReturnValue(
      mockFetchResponse({ data: [purchase] })
    );

    render(<Purchase customerId="C113" />);

    expect(
      await screen.findByText('{"id":1}')
    ).toBeInTheDocument();

    expect(
      screen.getByText('["Laptop","Mouse"]')
    ).toBeInTheDocument();

    expect(
      screen.getByText('{"transaction":"T003"}')
    ).toBeInTheDocument();
  });

  test("formats numeric and boolean values as strings", async () => {
    const purchase = {
      purchaseid: 123,
      productitem: false,
      transactionid: 456,
      purchasedt: `${currentYear}-05-10`,
    };

    global.fetch.mockReturnValue(
      mockFetchResponse({ data: [purchase] })
    );

    render(<Purchase customerId="C114" />);

    expect(await screen.findByText("123")).toBeInTheDocument();
    expect(screen.getByText("false")).toBeInTheDocument();
    expect(screen.getByText("456")).toBeInTheDocument();
  });

  test("filters records according to selected year", async () => {
    const purchases = [
      {
        purchaseid: "CURRENT",
        productitem: "Current product",
        transactionid: "T_CURRENT",
        purchasedt: `${currentYear}-05-10`,
      },
      {
        purchaseid: "OLD",
        productitem: "Old product",
        transactionid: "T_OLD",
        purchasedt: `${currentYear - 1}-05-10`,
      },
    ];

    global.fetch.mockReturnValue(
      mockFetchResponse({ data: purchases })
    );

    render(<Purchase customerId="C115" />);

    expect(await screen.findByText("CURRENT")).toBeInTheDocument();
    expect(screen.queryByText("OLD")).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: String(currentYear - 1) },
    });

    expect(await screen.findByText("OLD")).toBeInTheDocument();
    expect(screen.queryByText("CURRENT")).not.toBeInTheDocument();
  });

  test("uses purchaseDate when other date fields are missing", async () => {
    const purchase = {
      purchaseid: "P003",
      productitem: "Keyboard",
      transactionid: "T003",
      purchaseDate: `${currentYear}-04-10`,
    };

    global.fetch.mockReturnValue(
      mockFetchResponse({ data: [purchase] })
    );

    render(<Purchase customerId="C116" />);

    expect(await screen.findByText("P003")).toBeInTheDocument();
  });

  test("does not display records with invalid dates", async () => {
    const purchase = {
      purchaseid: "P004",
      productitem: "Monitor",
      transactionid: "T004",
      purchasedt: "invalid-date",
    };

    global.fetch.mockReturnValue(
      mockFetchResponse({ data: [purchase] })
    );

    render(<Purchase customerId="C117" />);

    expect(
      await screen.findByText(
        "You don't have any purchase record created this year"
      )
    ).toBeInTheDocument();
  });

  test("does not display records when purchase date is missing", async () => {
    const purchase = {
      purchaseid: "P005",
      productitem: "Mouse",
      transactionid: "T005",
    };

    global.fetch.mockReturnValue(
      mockFetchResponse({ data: [purchase] })
    );

    render(<Purchase customerId="C118" />);

    expect(
      await screen.findByText(
        "You don't have any purchase record created this year"
      )
    ).toBeInTheDocument();
  });

  test("uses purchaseId as the row key fallback", async () => {
    const purchase = {
      purchaseId: "P006",
      productItem: "Tablet",
      transactionId: "T006",
      purchaseDt: `${currentYear}-05-10`,
    };

    global.fetch.mockReturnValue(
      mockFetchResponse({ data: [purchase] })
    );

    render(<Purchase customerId="C119" />);

    expect(await screen.findByText("P006")).toBeInTheDocument();
  });

  test("renders multiple records", async () => {
    const purchases = [
      {
        purchaseid: "P007",
        productitem: "Laptop",
        transactionid: "T007",
        purchasedt: `${currentYear}-01-10`,
      },
      {
        purchaseid: "P008",
        productitem: "Phone",
        transactionid: "T008",
        purchasedt: `${currentYear}-02-10`,
      },
    ];

    global.fetch.mockReturnValue(
      mockFetchResponse({ data: purchases })
    );

    render(<Purchase customerId="C120" />);

    expect(await screen.findByText("P007")).toBeInTheDocument();
    expect(screen.getByText("P008")).toBeInTheDocument();
  });

  test("does not update component state after unmounting a successful request", async () => {
    let resolveFetch;

    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    const { unmount } = render(<Purchase customerId="C121" />);

    unmount();

    resolveFetch({
      ok: true,
      json: () => Promise.resolve({ data: [mockPurchase] }),
    });

    await waitFor(() => {
      expect(purchaseRequests.has("C121")).toBe(false);
    });
  });

  test("does not update component state after unmounting a failed request", async () => {
    let rejectFetch;

    global.fetch.mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          rejectFetch = reject;
        })
    );

    const { unmount } = render(<Purchase customerId="C122" />);

    unmount();

    rejectFetch(new Error("Network error"));

    await waitFor(() => {
      expect(purchaseRequests.has("C122")).toBe(false);
    });
  });

  test("fetches new data when customer ID changes", async () => {
    global.fetch
      .mockReturnValueOnce(
        mockFetchResponse({
          data: [
            {
              ...mockPurchase,
              purchaseid: "CUSTOMER_ONE",
            },
          ],
        })
      )
      .mockReturnValueOnce(
        mockFetchResponse({
          data: [
            {
              ...mockPurchase,
              purchaseid: "CUSTOMER_TWO",
            },
          ],
        })
      );

    const { rerender } = render(<Purchase customerId="C123" />);

    expect(
      await screen.findByText("CUSTOMER_ONE")
    ).toBeInTheDocument();

    rerender(<Purchase customerId="C124" />);

    expect(
      await screen.findByText("CUSTOMER_TWO")
    ).toBeInTheDocument();
  });
});