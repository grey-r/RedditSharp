import { CallbackPipePipe } from "./callback-pipe.pipe";

describe("CallbackPipePipe", () => {
  it("create an instance", () => {
    const pipe = new CallbackPipePipe();
    expect(pipe).toBeTruthy();
  });
});
