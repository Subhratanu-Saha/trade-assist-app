
import React, { StrictMode } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Case from "./case";

// ---------- helpers ----------

const okResponse = (body) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve(body),
});

const failResponse = (status = 500) => ({
  ok: false,
  status,
  json: () => Promise.resolve({}),
});

// Lets a test decide exactly when a fetch resolves/rejects.
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const sampleData = {
  data: {
    open: [{ caseId: "O-1" }, { caseId: "O-2" }],
    closed: [{ caseId: "C-1" }],
  },
};

describe("Case component", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    global.fetch = jest.fn();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  // ---------- loading / missing customer ----------

  describe("loading and missing customerId", () => {
    it("shows the loading message while the request is pending", async () => {
      const d = deferred();
      fetch.mockReturnValue(d.promise);

      render(<Case customerId="123" />);

      expect(screen.getByText("Loading case details...")).toBeInTheDocument();

      d.resolve(okResponse(sampleData));
      await waitFor(() =>
        expect(
          screen.queryByText("Loading case details...")
        ).not.toBeInTheDocument()
      );
    });

    it("shows an error and does not call the API when customerId is missing", async () => {
      render(<Case />);

      expect(
        await screen.findByText("Customer ID not found.")
      ).toBeInTheDocument();
      expect(fetch).not.toHaveBeenCalled();
    });

    it.each([["", "empty string"], [null, "null"], [0, "zero"]])(
      "treats %p (%s) as a missing customerId",
      async (value) => {
        render(<Case customerId={value} />);

        expect(
          await screen.findByText("Customer ID not found.")
        ).toBeInTheDocument();
        expect(fetch).not.toHaveBeenCalled();
      }
    );
  });

  // ---------- successful fetch ----------

  describe("successful fetch", () => {
    it("calls the correct endpoint (localhost base URL under jsdom)", async () => {
      fetch.mockResolvedValue(okResponse(sampleData));

      render(<Case customerId="123" />);
      await screen.findByText("Case ID O-1");

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/cases/list?customerId=123"
      );
    });

    it("URL-encodes the customerId", async () => {
      fetch.mockResolvedValue(okResponse(sampleData));

      render(<Case customerId="a b&c=d" />);
      await screen.findByText("Case ID O-1");

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/cases/list?customerId=a%20b%26c%3Dd"
      );
    });

    it("renders open and closed cases", async () => {
      fetch.mockResolvedValue(okResponse(sampleData));

      render(<Case customerId="123" />);

      expect(await screen.findByText("Case ID O-1")).toBeInTheDocument();
      expect(screen.getByText("Case ID O-2")).toBeInTheDocument();
      expect(screen.getByText("Case ID C-1")).toBeInTheDocument();

      expect(screen.getByText("Open Cases")).toBeInTheDocument();
      expect(screen.getByText("Closed Cases")).toBeInTheDocument();
      expect(
        screen.queryByText("No open cases available.")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("No closed cases available.")
      ).not.toBeInTheDocument();
    });

    it("renders the + New Case button", async () => {
      fetch.mockResolvedValue(okResponse(sampleData));

      render(<Case customerId="123" />);

      expect(
        await screen.findByRole("button", { name: "+ New Case" })
      ).toBeInTheDocument();
    });

    it("shows the empty state for open cases when there are none", async () => {
      fetch.mockResolvedValue(
        okResponse({ data: { open: [], closed: [{ caseId: "C-1" }] } })
      );

      render(<Case customerId="123" />);

      expect(
        await screen.findByText("No open cases available.")
      ).toBeInTheDocument();
      expect(screen.getByText("Case ID C-1")).toBeInTheDocument();
    });

    it("shows the empty state for closed cases when there are none", async () => {
      fetch.mockResolvedValue(
        okResponse({ data: { open: [{ caseId: "O-1" }], closed: [] } })
      );

      render(<Case customerId="123" />);

      expect(
        await screen.findByText("No closed cases available.")
      ).toBeInTheDocument();
      expect(screen.getByText("Case ID O-1")).toBeInTheDocument();
    });

    it("shows both empty states when both lists are empty", async () => {
      fetch.mockResolvedValue(okResponse({ data: { open: [], closed: [] } }));

      render(<Case customerId="123" />);

      expect(
        await screen.findByText("No open cases available.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("No closed cases available.")
      ).toBeInTheDocument();
    });
  });

  // ---------- defensive parsing of the response ----------

  describe("malformed API responses", () => {
    it.each([
      ["null body", null],
      ["empty object", {}],
      ["data is null", { data: null }],
      ["open/closed missing", { data: {} }],
      ["open/closed not arrays", { data: { open: "x", closed: { a: 1 } } }],
      ["open/closed null", { data: { open: null, closed: null } }],
    ])("falls back to empty lists for %s", async (_label, body) => {
      fetch.mockResolvedValue(okResponse(body));

      render(<Case customerId="123" />);

      expect(
        await screen.findByText("No open cases available.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("No closed cases available.")
      ).toBeInTheDocument();
    });
  });

  // ---------- error handling ----------

  describe("error handling", () => {
    it("shows an error when the response is not ok", async () => {
      fetch.mockResolvedValue(failResponse(500));

      render(<Case customerId="123" />);

      expect(
        await screen.findByText("Unable to load case details.")
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Loading case details...")
      ).not.toBeInTheDocument();
    });

    it("shows an error for a 404 response", async () => {
      fetch.mockResolvedValue(failResponse(404));

      render(<Case customerId="123" />);

      expect(
        await screen.findByText("Unable to load case details.")
      ).toBeInTheDocument();
    });

    it("shows an error when fetch rejects (network failure)", async () => {
      fetch.mockRejectedValue(new Error("Network down"));

      render(<Case customerId="123" />);

      expect(
        await screen.findByText("Unable to load case details.")
      ).toBeInTheDocument();
    });

    it("shows an error when response.json() rejects", async () => {
      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error("Bad JSON")),
      });

      render(<Case customerId="123" />);

      expect(
        await screen.findByText("Unable to load case details.")
      ).toBeInTheDocument();
    });

    it("clears a previous error when customerId changes to a valid one", async () => {
      fetch.mockResolvedValueOnce(failResponse(500));

      const { rerender } = render(<Case customerId="bad" />);
      await screen.findByText("Unable to load case details.");

      fetch.mockResolvedValueOnce(okResponse(sampleData));
      rerender(<Case customerId="good" />);

      expect(await screen.findByText("Case ID O-1")).toBeInTheDocument();
      expect(
        screen.queryByText("Unable to load case details.")
      ).not.toBeInTheDocument();
    });
  });

  // ---------- accordion behaviour ----------

  describe("accordion toggling", () => {
    beforeEach(() => {
      fetch.mockResolvedValue(okResponse(sampleData));
    });

    const getToggle = (caseId) =>
      screen.getByRole("button", { name: new RegExp(`Case ID ${caseId}`) });

    it("starts collapsed", async () => {
      render(<Case customerId="123" />);
      await screen.findByText("Case ID O-1");

      expect(getToggle("O-1")).toHaveAttribute("aria-expanded", "false");
      expect(getToggle("O-1")).toHaveTextContent("▼");
    });

    it("expands on click", async () => {
      render(<Case customerId="123" />);
      await screen.findByText("Case ID O-1");

      fireEvent.click(getToggle("O-1"));

      expect(getToggle("O-1")).toHaveAttribute("aria-expanded", "true");
      expect(getToggle("O-1")).toHaveTextContent("▲");
    });

    it("collapses when clicked a second time", async () => {
      render(<Case customerId="123" />);
      await screen.findByText("Case ID O-1");

      fireEvent.click(getToggle("O-1"));
      fireEvent.click(getToggle("O-1"));

      expect(getToggle("O-1")).toHaveAttribute("aria-expanded", "false");
      expect(getToggle("O-1")).toHaveTextContent("▼");
    });

    it("only keeps one case expanded at a time", async () => {
      render(<Case customerId="123" />);
      await screen.findByText("Case ID O-1");

      fireEvent.click(getToggle("O-1"));
      fireEvent.click(getToggle("O-2"));

      expect(getToggle("O-1")).toHaveAttribute("aria-expanded", "false");
      expect(getToggle("O-2")).toHaveAttribute("aria-expanded", "true");
    });

    it("works across open and closed sections", async () => {
      render(<Case customerId="123" />);
      await screen.findByText("Case ID O-1");

      fireEvent.click(getToggle("O-1"));
      fireEvent.click(getToggle("C-1"));

      expect(getToggle("O-1")).toHaveAttribute("aria-expanded", "false");
      expect(getToggle("C-1")).toHaveAttribute("aria-expanded", "true");
    });

    it("uses the index as the id when an open case has no caseId", async () => {
      fetch.mockResolvedValue(
        okResponse({ data: { open: [{}, {}], closed: [] } })
      );

      render(<Case customerId="123" />);
      await waitFor(() =>
        expect(screen.getAllByRole("button", { name: /Case ID/ })).toHaveLength(
          2
        )
      );

      const [first, second] = screen.getAllByRole("button", {
        name: /Case ID/,
      });

      fireEvent.click(second);

      expect(first).toHaveAttribute("aria-expanded", "false");
      expect(
        screen.getAllByRole("button", { name: /Case ID/ })[1]
      ).toHaveAttribute("aria-expanded", "true");
    });

    it("uses the index as the id when a closed case has no caseId", async () => {
      fetch.mockResolvedValue(
        okResponse({ data: { open: [], closed: [{}, {}] } })
      );

      render(<Case customerId="123" />);

      const buttons = await screen.findAllByRole("button", {
        name: /Case ID/,
      });
      expect(buttons).toHaveLength(2);

      fireEvent.click(buttons[1]);

      expect(
        screen.getAllByRole("button", { name: /Case ID/ })[1]
      ).toHaveAttribute("aria-expanded", "true");
    });
  });

  // ---------- request de-duplication cache ----------

  describe("caseRequestCache", () => {
    it("de-duplicates in-flight requests under React StrictMode", async () => {
      fetch.mockResolvedValue(okResponse(sampleData));

      render(
        <StrictMode>
          <Case customerId="123" />
        </StrictMode>
      );

      expect(await screen.findByText("Case ID O-1")).toBeInTheDocument();
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("shares one request between two components with the same customerId", async () => {
      const d = deferred();
      fetch.mockReturnValue(d.promise);

      render(
        <>
          <Case customerId="123" />
          <Case customerId="123" />
        </>
      );

      expect(fetch).toHaveBeenCalledTimes(1);

      d.resolve(okResponse(sampleData));
      await waitFor(() =>
        expect(screen.getAllByText("Case ID O-1")).toHaveLength(2)
      );
    });

    it("does not share requests between different customerIds", async () => {
      fetch.mockResolvedValue(okResponse(sampleData));

      render(
        <>
          <Case customerId="111" />
          <Case customerId="222" />
        </>
      );

      await waitFor(() =>
        expect(screen.getAllByText("Case ID O-1")).toHaveLength(2)
      );
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("removes the cache entry after success so the next mount fetches fresh data", async () => {
      fetch.mockResolvedValue(okResponse(sampleData));

      const first = render(<Case customerId="123" />);
      await screen.findByText("Case ID O-1");
      first.unmount();

      render(<Case customerId="123" />);
      await screen.findByText("Case ID O-1");

      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it("removes the cache entry after a failure so a retry hits the API again", async () => {
      fetch.mockResolvedValueOnce(failResponse(500));

      const first = render(<Case customerId="123" />);
      await screen.findByText("Unable to load case details.");
      first.unmount();

      fetch.mockResolvedValueOnce(okResponse(sampleData));
      render(<Case customerId="123" />);

      expect(await screen.findByText("Case ID O-1")).toBeInTheDocument();
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  // ---------- stale request / unmount safety ----------

  describe("stale requests and unmounting", () => {
    it("does not update state if unmounted before the request succeeds", async () => {
      const d = deferred();
      fetch.mockReturnValue(d.promise);

      const { unmount } = render(<Case customerId="123" />);
      unmount();

      d.resolve(okResponse(sampleData));
      await new Promise((r) => setTimeout(r, 0));

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("does not update state if unmounted before the request fails", async () => {
      const d = deferred();
      fetch.mockReturnValue(d.promise);

      const { unmount } = render(<Case customerId="123" />);
      unmount();

      d.reject(new Error("boom"));
      await new Promise((r) => setTimeout(r, 0));

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("ignores a slow response for an old customerId after the id changes", async () => {
      const slow = deferred();
      const fast = deferred();

      fetch.mockReturnValueOnce(slow.promise).mockReturnValueOnce(fast.promise);

      const { rerender } = render(<Case customerId="old" />);
      rerender(<Case customerId="new" />);

      // New request finishes first.
      fast.resolve(okResponse({ data: { open: [{ caseId: "NEW" }], closed: [] } }));
      expect(await screen.findByText("Case ID NEW")).toBeInTheDocument();

      // Old request finishes late and must be ignored.
      slow.resolve(okResponse({ data: { open: [{ caseId: "OLD" }], closed: [] } }));
      await new Promise((r) => setTimeout(r, 0));

      expect(screen.getByText("Case ID NEW")).toBeInTheDocument();
      expect(screen.queryByText("Case ID OLD")).not.toBeInTheDocument();
    });

    it("refetches when customerId changes", async () => {
      fetch.mockResolvedValue(okResponse(sampleData));

      const { rerender } = render(<Case customerId="1" />);
      await screen.findByText("Case ID O-1");

      rerender(<Case customerId="2" />);
      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

      expect(fetch).toHaveBeenLastCalledWith(
        "http://localhost:5000/api/v1/cases/list?customerId=2"
      );
    });
  });
});

// ---------- API_BASE_URL (evaluated once, at module load) ----------

describe("API_BASE_URL selection", () => {
  const originalLocation = window.location;
  const originalSkipCleanup = process.env.RTL_SKIP_AUTO_CLEANUP;
  let isolatedRender;

  beforeEach(() => {
    isolatedRender = null;
  });

  afterEach(() => {
    // Unmount the isolated copy manually (its auto-cleanup is disabled below).
    if (isolatedRender) {
      isolatedRender.unmount();
    }

    window.location = originalLocation;

    if (originalSkipCleanup === undefined) {
      delete process.env.RTL_SKIP_AUTO_CLEANUP;
    } else {
      process.env.RTL_SKIP_AUTO_CLEANUP = originalSkipCleanup;
    }

    delete global.fetch;
    jest.resetModules();
  });

  // Loads a fresh copy of the component (and React) with a given hostname.
  const renderWithHostname = async (hostname) => {
    delete window.location;
    window.location = { hostname };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: { open: [], closed: [] } }),
    });

    // Requiring @testing-library/react normally registers its own afterEach
    // hook, which Jest forbids inside a running test. This flag turns that off.
    process.env.RTL_SKIP_AUTO_CLEANUP = "true";

    jest.isolateModules(() => {
      const IsolatedReact = require("react");
      const rtl = require("@testing-library/react");
      const IsolatedCase = require("./case").default;

      isolatedRender = rtl.render(
        IsolatedReact.createElement(IsolatedCase, { customerId: "123" })
      );
    });

    await waitFor(() => expect(fetch).toHaveBeenCalled());
  };

  it("uses the local API when hostname is localhost", async () => {
    await renderWithHostname("localhost");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/v1/cases/list?customerId=123"
    );
  });

  it("uses the production API for any other hostname", async () => {
    await renderWithHostname("trade-assist.example.com");

    expect(fetch).toHaveBeenCalledWith(
      "https://trade-assist-api.onrender.com/api/v1/cases/list?customerId=123"
    );
  });
});