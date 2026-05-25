import assert from "node:assert/strict";
import test from "node:test";

import { normalizeInterestLabel } from "../../src/utils/interestUtils";
import { shortUniversity, tabLabel } from "../../src/utils/format";
import { isWholeNumber } from "../../src/utils/validation";
import { styles } from "../../src/styles";

test("unit: normalizes typed interest labels to database-safe tags", () => {
  assert.equal(normalizeInterestLabel(" Movie Night! "), "#movie_night");
});

test("unit: preserves valid lowercase hashtag labels", () => {
  assert.equal(normalizeInterestLabel("#coffee"), "#coffee");
});

test("unit: accepts whole-number age input", () => {
  assert.equal(isWholeNumber(" 21 "), true);
});

test("unit: rejects decimal age input", () => {
  assert.equal(isWholeNumber("21.5"), false);
});

test("unit: returns expected short university badge label", () => {
  assert.equal(shortUniversity("UC Irvine"), "UCI");
  assert.equal(tabLabel("communities"), "Communities");
});

test("unit: exposes core style tokens used by the app shell", () => {
  assert.equal(styles.appRoot.backgroundColor, "#F7F2E8");
  assert.equal(styles.primaryButton.backgroundColor, "#2F6F73");
  assert.equal(styles.cardTitle.fontWeight, "800");
});
