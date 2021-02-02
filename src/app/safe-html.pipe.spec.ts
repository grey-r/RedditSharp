import { DomSanitizer } from "@angular/platform-browser";
import { SafeHTMLPipe } from "./safe-html.pipe";

describe("SafeHTMLPipe", () => {
  let sanitizer: DomSanitizer;
  it("create an instance", () => {
    const pipe = new SafeHTMLPipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
});
