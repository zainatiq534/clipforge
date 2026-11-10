import "dotenv/config";
import { transcribeVerboseViaLocal } from "../src/services/localWhisper.ts";

const url =
  process.argv[2] ||
  "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav";

console.log("smoke start", url);
const segs = await transcribeVerboseViaLocal(url);
console.log("smoke ok", segs.length);
for (const s of segs) {
  console.log(`  ${s.startSec}-${s.endSec}: ${s.text}`);
}
