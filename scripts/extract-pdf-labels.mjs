// Ekstrak posisi (x,y) seluruh string teks pada halaman 1 template surat.
// Pakai: node scripts/extract-pdf-labels.mjs
// Output: console JSON [{text,x,y,fontSize}]
//
// Catatan: pdf-lib tidak punya text extraction; kita parse content stream
// halaman secara manual untuk operator Tj/TJ + matriks Tm/Td/TD.

import fs from "node:fs";
import path from "node:path";
import { PDFDocument, PDFName, PDFStream } from "pdf-lib";

const TEMPLATE = path.join(
  process.cwd(),
  "public",
  "template",
  "BLANKO_PENGANTAR_RT_kiri.pdf"
);

function decodeStream(stream) {
  // pdf-lib decodes filtered streams for us when calling .getContents()
  // but only after decoding via .getUnencodedContents() for newer versions.
  if (typeof stream.getUnencodedContents === "function") {
    return Buffer.from(stream.getUnencodedContents()).toString("latin1");
  }
  return Buffer.from(stream.getContents()).toString("latin1");
}

// Parser kasar untuk PDF content stream
function extractTextOps(content) {
  // Token-isasi dengan regex sederhana
  const items = [];
  // State teks
  let tm = [1, 0, 0, 1, 0, 0]; // text matrix
  let tlm = [1, 0, 0, 1, 0, 0]; // text line matrix
  let fontSize = 0;
  let inText = false;

  // Pecah ke token kasar
  // Pertahankan literal string (...) dan hex <...>
  const tokens = [];
  let i = 0;
  while (i < content.length) {
    const c = content[i];
    if (c === "(") {
      let depth = 1;
      let j = i + 1;
      let s = "";
      while (j < content.length && depth > 0) {
        const ch = content[j];
        if (ch === "\\" && j + 1 < content.length) {
          s += content[j] + content[j + 1];
          j += 2;
          continue;
        }
        if (ch === "(") depth++;
        else if (ch === ")") {
          depth--;
          if (depth === 0) break;
        }
        s += ch;
        j++;
      }
      tokens.push({ type: "string", value: decodePdfString(s) });
      i = j + 1;
    } else if (c === "<" && content[i + 1] !== "<") {
      let j = i + 1;
      let s = "";
      while (j < content.length && content[j] !== ">") {
        s += content[j];
        j++;
      }
      tokens.push({ type: "string", value: decodeHexString(s) });
      i = j + 1;
    } else if (c === "[") {
      // array (untuk TJ)
      let depth = 1;
      let j = i + 1;
      let s = "";
      while (j < content.length && depth > 0) {
        const ch = content[j];
        if (ch === "[") depth++;
        else if (ch === "]") {
          depth--;
          if (depth === 0) break;
        }
        s += ch;
        j++;
      }
      tokens.push({ type: "array", value: s });
      i = j + 1;
    } else if (/\s/.test(c)) {
      i++;
    } else {
      // baca sampai whitespace / paren / bracket
      let j = i;
      while (j < content.length && !/[\s()\[\]<>]/.test(content[j])) j++;
      const tok = content.slice(i, j);
      tokens.push({ type: "token", value: tok });
      i = j;
    }
  }

  // Stack operand
  let stack = [];
  for (const t of tokens) {
    if (t.type === "string" || t.type === "array") {
      stack.push(t);
      continue;
    }
    if (t.type === "token") {
      const v = t.value;
      // operator?
      if (/^-?\d+(\.\d+)?$/.test(v)) {
        stack.push({ type: "num", value: parseFloat(v) });
        continue;
      }
      if (v === "/") {
        // pre-name? bukan
        stack.push({ type: "raw", value: "/" });
        continue;
      }
      // jika dimulai dengan "/", ini name
      if (v.startsWith("/")) {
        stack.push({ type: "name", value: v.slice(1) });
        continue;
      }
      // operator
      switch (v) {
        case "BT":
          inText = true;
          tm = [1, 0, 0, 1, 0, 0];
          tlm = [1, 0, 0, 1, 0, 0];
          stack = [];
          break;
        case "ET":
          inText = false;
          stack = [];
          break;
        case "Tf": {
          // size operand
          const size = stack.pop()?.value ?? 0;
          const name = stack.pop()?.value ?? "";
          fontSize = typeof size === "number" ? size : parseFloat(size);
          void name;
          stack = [];
          break;
        }
        case "Tm": {
          // 6 nums
          if (stack.length >= 6) {
            const nums = stack.slice(-6).map((s) => s.value);
            tm = nums.slice();
            tlm = nums.slice();
          }
          stack = [];
          break;
        }
        case "Td":
        case "TD": {
          if (stack.length >= 2) {
            const ty = stack.pop().value;
            const tx = stack.pop().value;
            // tlm := [1 0 0 1 tx ty] * tlm
            tlm = [tlm[0], tlm[1], tlm[2], tlm[3], tx * tlm[0] + ty * tlm[2] + tlm[4], tx * tlm[1] + ty * tlm[3] + tlm[5]];
            tm = tlm.slice();
          }
          stack = [];
          break;
        }
        case "T*": {
          // pindah baris, leading default 0
          // sederhana: tidak diubah
          stack = [];
          break;
        }
        case "Tj": {
          const s = stack.pop();
          if (inText && s && s.type === "string") {
            items.push({ text: s.value, x: tm[4], y: tm[5], fontSize });
          }
          stack = [];
          break;
        }
        case "'": {
          const s = stack.pop();
          if (inText && s && s.type === "string") {
            items.push({ text: s.value, x: tm[4], y: tm[5], fontSize });
          }
          stack = [];
          break;
        }
        case '"': {
          const s = stack.pop();
          if (inText && s && s.type === "string") {
            items.push({ text: s.value, x: tm[4], y: tm[5], fontSize });
          }
          stack = [];
          break;
        }
        case "TJ": {
          const arr = stack.pop();
          if (inText && arr && arr.type === "array") {
            // gabungkan elemen string
            const inner = arr.value;
            // ekstrak (...) string saja
            const strs = [];
            let k = 0;
            while (k < inner.length) {
              const ch = inner[k];
              if (ch === "(") {
                let depth = 1;
                let m = k + 1;
                let s = "";
                while (m < inner.length && depth > 0) {
                  const cc = inner[m];
                  if (cc === "\\" && m + 1 < inner.length) {
                    s += inner[m] + inner[m + 1];
                    m += 2;
                    continue;
                  }
                  if (cc === "(") depth++;
                  else if (cc === ")") {
                    depth--;
                    if (depth === 0) break;
                  }
                  s += cc;
                  m++;
                }
                strs.push(decodePdfString(s));
                k = m + 1;
              } else if (ch === "<") {
                let m = k + 1;
                let s = "";
                while (m < inner.length && inner[m] !== ">") {
                  s += inner[m];
                  m++;
                }
                strs.push(decodeHexString(s));
                k = m + 1;
              } else k++;
            }
            items.push({ text: strs.join(""), x: tm[4], y: tm[5], fontSize });
          }
          stack = [];
          break;
        }
        default:
          // operator lain yang tidak menyentuh teks: reset stack
          stack = [];
      }
    }
  }
  return items;
}

function decodePdfString(s) {
  // tangani escape \\, \(, \), \n, \r, \t, \b, \f, \\NNN (octal)
  return s
    .replace(/\\([nrtbf\\()])/g, (_, c) => {
      const map = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "\\": "\\", "(": "(", ")": ")" };
      return map[c] ?? c;
    })
    .replace(/\\(\d{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}

function decodeHexString(s) {
  const clean = s.replace(/\s+/g, "");
  let out = "";
  for (let i = 0; i < clean.length; i += 2) {
    out += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
  }
  return out;
}

async function main() {
  const bytes = fs.readFileSync(TEMPLATE);
  const pdf = await PDFDocument.load(bytes);
  const page = pdf.getPages()[0];
  const { width, height } = page.getSize();

  // Ambil content stream(s)
  const contentRef = page.node.Contents();
  const ctx = pdf.context;
  let content = "";
  if (contentRef) {
    const obj = ctx.lookup(contentRef);
    if (obj instanceof PDFStream) {
      content = decodeStream(obj);
    } else if (obj && typeof obj.asArray === "function") {
      for (const ref of obj.asArray()) {
        const s = ctx.lookup(ref);
        if (s instanceof PDFStream) content += "\n" + decodeStream(s);
      }
    }
  }

  // Resource Font (untuk peta name -> font), tidak wajib karena kita hanya butuh posisi
  void PDFName;

  const items = extractTextOps(content);
  // Filter teks yang tidak kosong
  const cleaned = items
    .filter((it) => it.text && it.text.trim().length > 0)
    .map((it) => ({
      text: it.text.trim(),
      x: +it.x.toFixed(2),
      y: +it.y.toFixed(2),
      top: +(height - it.y).toFixed(2),
      fontSize: it.fontSize,
    }));

  console.log(JSON.stringify({ page: { width, height }, items: cleaned }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
