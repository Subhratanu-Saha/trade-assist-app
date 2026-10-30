import logger from "./logger";

describe("logger", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(["info", "warn", "error"])("prefixes %s messages", (level) => {
    const consoleMethod = jest.spyOn(console, level).mockImplementation(() => {});

    logger[level]("Request failed", 500);

    expect(consoleMethod).toHaveBeenCalledWith(
      "Trade-Assist FE - Request failed",
      500
    );
  });
});