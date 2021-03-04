import slugify from "./slugify";

describe("slugify", () => {
  it("slugifies", () => {
    expect(slugify("elliott rules")).toEqual("elliott-rules");
    expect(slugify("elliott's great")).toEqual("elliotts-great");
    expect(slugify("multiple--dashes")).toEqual("multiple-dashes");
  });
});
