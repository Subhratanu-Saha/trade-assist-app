describe("index.js", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    document.body.innerHTML = '<div id="root"></div>';
  });

  test("should create root, render App inside StrictMode and BrowserRouter, and call reportWebVitals", () => {
    const React = require("react");

    const mockRender = jest.fn();
    const mockRoot = {
      render: mockRender,
    };

    const mockCreateRoot = jest.fn(() => mockRoot);
    const mockReportWebVitals = jest.fn();

    jest.doMock("react-dom/client", () => ({
      __esModule: true,
      default: {
        createRoot: mockCreateRoot,
      },
    }));

    jest.doMock("react-router-dom", () => ({
      BrowserRouter: ({ children }) => children,
    }));

    jest.doMock("./App", () => ({
      __esModule: true,
      default: () => null,
    }));

    jest.doMock("./reportWebVitals", () => ({
      __esModule: true,
      default: mockReportWebVitals,
    }));

    jest.doMock("./index.css", () => ({}));

    jest.isolateModules(() => {
      require("./index");
    });

    const rootElement = document.getElementById("root");

    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockCreateRoot).toHaveBeenCalledWith(rootElement);

    expect(mockRender).toHaveBeenCalledTimes(1);

    const renderedElement = mockRender.mock.calls[0][0];

    expect(React.isValidElement(renderedElement)).toBe(true);
    expect(renderedElement.type).toBe(React.StrictMode);

    const routerElement = renderedElement.props.children;

    expect(React.isValidElement(routerElement)).toBe(true);
    expect(routerElement.type.name).toBe("BrowserRouter");

    expect(mockReportWebVitals).toHaveBeenCalledTimes(1);
  });
});