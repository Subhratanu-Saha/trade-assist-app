import { waitFor } from "@testing-library/react";

// Only treat the mock as virtual if 'web-vitals' isn't actually installed.
let isInstalled = true;
try {
  require.resolve("web-vitals");
} catch (e) {
  isInstalled = false;
}

const metricNames = ["getCLS", "getFID", "getFCP", "getLCP", "getTTFB"];

// Gives the dynamic import() promise chain time to settle (used when
// asserting that nothing was called).
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 100));

// A plain function (not jest.fn) so `onPerfEntry instanceof Function` is true.
// It counts how many times it was called.
const makeCallback = () => {
  const callback = function () {
    callback.callCount += 1;
  };
  callback.callCount = 0;
  return callback;
};

// Loads a fresh reportWebVitals that is wired to a fresh set of mocks.
const loadWithMocks = () => {
  jest.resetModules();

  const mocks = {
    getCLS: jest.fn(),
    getFID: jest.fn(),
    getFCP: jest.fn(),
    getLCP: jest.fn(),
    getTTFB: jest.fn(),
  };

  jest.doMock("web-vitals", () => mocks, { virtual: !isInstalled });

  const reportWebVitals = require("./reportWebVitals").default;

  return { reportWebVitals, mocks };
};

describe("reportWebVitals", () => {
  it("calls every web-vitals metric with the callback when given a function", async () => {
    const { reportWebVitals, mocks } = loadWithMocks();
    const onPerfEntry = makeCallback();

    reportWebVitals(onPerfEntry);

    await waitFor(
      () => {
        metricNames.forEach((name) => {
          expect(mocks[name]).toHaveBeenCalledWith(onPerfEntry);
        });
      },
      { timeout: 3000 }
    );

    metricNames.forEach((name) => {
      expect(mocks[name]).toHaveBeenCalledTimes(1);
    });
  });

  it("accepts a regular (non-arrow) function as the callback", async () => {
    const { reportWebVitals, mocks } = loadWithMocks();
    function onPerfEntry() {}

    reportWebVitals(onPerfEntry);

    await waitFor(
      () => {
        expect(mocks.getCLS).toHaveBeenCalledWith(onPerfEntry);
        expect(mocks.getTTFB).toHaveBeenCalledWith(onPerfEntry);
      },
      { timeout: 3000 }
    );
  });

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["false", false],
    ["0", 0],
    ["an empty string", ""],
  ])("does nothing when the callback is %s", async (_label, value) => {
    const { reportWebVitals, mocks } = loadWithMocks();

    reportWebVitals(value);
    await flushPromises();

    metricNames.forEach((name) => {
      expect(mocks[name]).not.toHaveBeenCalled();
    });
  });

  it("does nothing when called with no arguments", async () => {
    const { reportWebVitals, mocks } = loadWithMocks();

    reportWebVitals();
    await flushPromises();

    metricNames.forEach((name) => {
      expect(mocks[name]).not.toHaveBeenCalled();
    });
  });

  it.each([
    ["a string", "not a function"],
    ["a number", 42],
    ["an object", { cb: () => {} }],
    ["an array", []],
    ["true", true],
  ])(
    "does nothing when the callback is %s (truthy but not a function)",
    async (_label, value) => {
      const { reportWebVitals, mocks } = loadWithMocks();

      reportWebVitals(value);
      await flushPromises();

      metricNames.forEach((name) => {
        expect(mocks[name]).not.toHaveBeenCalled();
      });
    }
  );

  it("does not invoke the callback itself (only passes it to web-vitals)", async () => {
    const { reportWebVitals, mocks } = loadWithMocks();
    const onPerfEntry = makeCallback();

    reportWebVitals(onPerfEntry);

    await waitFor(
      () => {
        expect(mocks.getCLS).toHaveBeenCalledWith(onPerfEntry);
      },
      { timeout: 3000 }
    );
    expect(onPerfEntry.callCount).toBe(0);
  });
});