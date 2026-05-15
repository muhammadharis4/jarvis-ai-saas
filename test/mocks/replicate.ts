import { jest } from "@jest/globals";

export const mockReplicateRun = jest.fn();

export default class ReplicateMock {
  run = mockReplicateRun;
}
