var Application = require("spectron").Application;
const fs = require('fs');
var assert = require("assert");

const path = "./app-builds/mac-universal/Soulmate.app/Contents/MacOS/Soulmate";

describe("Application launch", function () {
  this.timeout(10000)

  before(() => {
    this.app = new Application({ path });
    return this.app.start();
  })

  it("launches", () =>
    this.app.browserWindow.isVisible()
      .then((isVisible) => assert.equal(isVisible, true))
      .then(() => this.app.client.getTitle())
      .then((title) => assert.equal(title, "Home | Soulmate IDE"))
      .catch((error) => console.error("Test failed", error.message))
  );

  after(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })
});
