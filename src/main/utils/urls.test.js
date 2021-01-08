import { host, url } from "./urls";

describe("urls", () => {
  it("uses production URLs", () => {
    expect(host).toEqual("https://editor.soulmatelights.com");
    expect(url("/a")).toEqual("https://editor.soulmatelights.com/a");
  });

  it("adds a slash", () => {
    expect(url("a")).toEqual("https://editor.soulmatelights.com/a");
  });

  it("removes extra slash", () => {
    expect(url("//a")).toEqual("https://editor.soulmatelights.com/a");
  });
});
