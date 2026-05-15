import { describe, expect, it } from "@jest/globals";
import axios from "axios";

import { getApiErrorMessage } from "./get-api-error-message";

describe("getApiErrorMessage", () => {
  it("reads string bodies from Axios errors", () => {
    const err = axios.AxiosError.from(
      new Error("req failed"),
      "ERR_BAD_RESPONSE",
      undefined,
      undefined,
      {
        status: 400,
        statusText: "Bad Request",
        data: " Prompt is required ",
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
      },
    );
    expect(getApiErrorMessage(err)).toBe("Prompt is required");
  });

  it("handles 401 and 500 with defaults", () => {
    expect(
      getApiErrorMessage(
        axios.AxiosError.from(new Error(""), "ERR_BAD_REQUEST", undefined, undefined, {
          status: 401,
          statusText: "Unauthorized",
          data: "",
          headers: {},
          config: { headers: new axios.AxiosHeaders() },
        }),
      ),
    ).toContain("signed in");

    expect(
      getApiErrorMessage(
        axios.AxiosError.from(new Error(""), "ERR_BAD_RESPONSE", undefined, undefined, {
          status: 500,
          statusText: "Err",
          data: "",
          headers: {},
          config: { headers: new axios.AxiosHeaders() },
        }),
      ),
    ).toContain("Server error");
  });

  it("falls back on unknown errors", () => {
    expect(getApiErrorMessage(new Error("oops"), "fallback")).toBe("fallback");
  });
});
