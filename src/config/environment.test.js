import { vi, expect, test } from "vitest";
import { loadRolesConfiguration, ROLE_PREFIX } from "./environment";

const matches = (search) => {
  return conf.some(
    (role) => search.name === role.name && search.id === role.id
  );
};

test("Load roles from environment", () => {
  const testRoles = [
    { name: "ROLE_TEST_ONE", id: "1111" },
    { name: "ROLE_TEST_TWO", id: "2222" },
  ];
  for (const testRole of testRoles) {
    vi.stubEnv(`${ROLE_PREFIX}${testRole.name}`, testRole.id);
  }

  const config = loadRolesConfiguration();
  expect(testRoles.every((role) => matches(role))).toBe(true);
});
