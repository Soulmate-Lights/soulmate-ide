import { renameDefines } from "./replaceDefines";

describe("Renaming defines", () => {
  it("renames defines", () => {
    const input = "#define MYTHING";
    const prefix = "hello";
    const expectedOutput = "#define hello_MYTHING";

    expect(renameDefines(prefix, input)).toEqual(expectedOutput);
  });

  it("renames function defines", () => {
    const input = "#define MYTHING(int a, int b)";
    const prefix = "hello";
    const expectedOutput = "#define hello_MYTHING(int a, int b)";

    expect(renameDefines(prefix, input)).toEqual(expectedOutput);
  });

  it("renames things when used multiple times", () => {
    const input = `
    #define MYTHING(int a, int b)
    MYTHING(1, 2);`;
    const prefix = "hello";

    const expectedOutput = `
    #define hello_MYTHING(int a, int b)
    hello_MYTHING(1, 2);`;

    expect(renameDefines(prefix, input)).toEqual(expectedOutput);
  });
});
