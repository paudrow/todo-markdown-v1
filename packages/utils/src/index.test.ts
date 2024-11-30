import { strict as assert } from "assert";
import { addTwoPlusTwo } from "./index";

describe("addTwoPlusTwo", () => {
  it("should return 4", () => {
    assert.equal(addTwoPlusTwo(), 4);
  });
});
