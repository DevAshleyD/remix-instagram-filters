import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {}),
      /* @__PURE__ */ jsx("script", { src: "https://cdn.tailwindcss.com" })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
function ImageUploader({ onImageUpload }) {
  const fileInputRef = useRef(null);
  const handleFileChange = (event) => {
    var _a;
    const file = (_a = event.target.files) == null ? void 0 : _a[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
  };
  const handleDrop = (event) => {
    var _a;
    event.preventDefault();
    const file = (_a = event.dataTransfer.files) == null ? void 0 : _a[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "w-full max-w-2xl mx-auto",
      onDrop: handleDrop,
      onDragOver: handleDragOver,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "border-4 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100 relative overflow-hidden",
          onClick: () => {
            var _a;
            return (_a = fileInputRef.current) == null ? void 0 : _a.click();
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }),
              "Secure local processing"
            ] }),
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-16 h-16 mx-auto mb-4 text-gray-400",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-700 mb-2", children: "Upload by dragging or clicking on the image" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-3", children: "JPG, PNG, GIF, WEBP Format Support" }),
            /* @__PURE__ */ jsxs("div", { className: "bg-green-50 rounded-lg px-4 py-2 inline-flex items-center gap-2 text-xs text-green-700", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Images are not sent to the server" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/*",
                onChange: handleFileChange,
                className: "hidden"
              }
            )
          ]
        }
      )
    }
  );
}
function grayscale(pixels) {
  const d = pixels.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const avg = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    d[i] = d[i + 1] = d[i + 2] = avg;
  }
  return pixels;
}
function sepia(pixels, adj) {
  const d = pixels.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    d[i] = r * (1 - 0.607 * adj) + g * 0.769 * adj + b * 0.189 * adj;
    d[i + 1] = r * 0.349 * adj + g * (1 - 0.314 * adj) + b * 0.168 * adj;
    d[i + 2] = r * 0.272 * adj + g * 0.534 * adj + b * (1 - 0.869 * adj);
  }
  return pixels;
}
function brightness(pixels, adj) {
  const d = pixels.data;
  adj = Math.max(-1, Math.min(1, adj));
  const adjValue = Math.round(255 * adj);
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.max(0, Math.min(255, d[i] + adjValue));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + adjValue));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + adjValue));
  }
  return pixels;
}
function saturation(pixels, adj) {
  const d = pixels.data;
  adj = Math.max(-1, adj);
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
    d[i] = Math.max(0, Math.min(255, -gray * adj + d[i] * (1 + adj)));
    d[i + 1] = Math.max(0, Math.min(255, -gray * adj + d[i + 1] * (1 + adj)));
    d[i + 2] = Math.max(0, Math.min(255, -gray * adj + d[i + 2] * (1 + adj)));
  }
  return pixels;
}
function contrast(pixels, adj) {
  const adjValue = adj * 255;
  const d = pixels.data;
  const factor = 259 * (adjValue + 255) / (255 * (259 - adjValue));
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.max(0, Math.min(255, factor * (d[i] - 128) + 128));
    d[i + 1] = Math.max(0, Math.min(255, factor * (d[i + 1] - 128) + 128));
    d[i + 2] = Math.max(0, Math.min(255, factor * (d[i + 2] - 128) + 128));
  }
  return pixels;
}
function colorFilter(pixels, rgbColor) {
  const d = pixels.data;
  const adj = rgbColor[3];
  for (let i = 0; i < d.length; i += 4) {
    d[i] = d[i] - (d[i] - rgbColor[0]) * adj;
    d[i + 1] = d[i + 1] - (d[i + 1] - rgbColor[1]) * adj;
    d[i + 2] = d[i + 2] - (d[i + 2] - rgbColor[2]) * adj;
  }
  return pixels;
}
function rgbAdjust(pixels, rgbAdj) {
  const d = pixels.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.max(0, Math.min(255, d[i] * rgbAdj[0]));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] * rgbAdj[1]));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] * rgbAdj[2]));
  }
  return pixels;
}
function convolute(pixels, weights) {
  const side = Math.round(Math.sqrt(weights.length));
  const halfSide = Math.floor(side / 2);
  const d = pixels.data;
  const sw = pixels.width;
  const sh = pixels.height;
  const output = new Uint8ClampedArray(d.length);
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const dstOff = (y * sw + x) * 4;
      let r = 0, g = 0, b = 0;
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = y + cy - halfSide;
          const scx = x + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            const srcOff = (scy * sw + scx) * 4;
            const wt = weights[cy * side + cx];
            r += d[srcOff] * wt;
            g += d[srcOff + 1] * wt;
            b += d[srcOff + 2] * wt;
          }
        }
      }
      output[dstOff] = Math.max(0, Math.min(255, r));
      output[dstOff + 1] = Math.max(0, Math.min(255, g));
      output[dstOff + 2] = Math.max(0, Math.min(255, b));
      output[dstOff + 3] = d[dstOff + 3];
    }
  }
  for (let i = 0; i < d.length; i++) {
    d[i] = output[i];
  }
  return pixels;
}
function sharpen(pixels, amount = 1) {
  return convolute(pixels, [
    0,
    -1 * amount,
    0,
    -1 * amount,
    1 + 4 * amount,
    -1 * amount,
    0,
    -1 * amount,
    0
  ]);
}
const normal = (pixels) => pixels;
const clarendon = (pixels) => {
  pixels = brightness(pixels, 0.1);
  pixels = contrast(pixels, 0.1);
  pixels = saturation(pixels, 0.15);
  return pixels;
};
const gingham = (pixels) => {
  pixels = sepia(pixels, 0.04);
  pixels = contrast(pixels, -0.15);
  return pixels;
};
const reyes = (pixels) => {
  pixels = sepia(pixels, 0.4);
  pixels = brightness(pixels, 0.13);
  pixels = contrast(pixels, -0.05);
  return pixels;
};
const stinson = (pixels) => {
  pixels = brightness(pixels, 0.1);
  pixels = sepia(pixels, 0.3);
  return pixels;
};
const earlybird = (pixels) => {
  pixels = colorFilter(pixels, [255, 165, 40, 0.2]);
  return pixels;
};
const toaster = (pixels) => {
  pixels = sepia(pixels, 0.1);
  pixels = colorFilter(pixels, [255, 145, 0, 0.2]);
  return pixels;
};
const walden = (pixels) => {
  pixels = brightness(pixels, 0.1);
  pixels = colorFilter(pixels, [255, 255, 0, 0.2]);
  return pixels;
};
const f1977 = (pixels) => {
  pixels = colorFilter(pixels, [255, 25, 0, 0.15]);
  pixels = brightness(pixels, 0.1);
  return pixels;
};
const brooklyn = (pixels) => {
  pixels = colorFilter(pixels, [25, 240, 252, 0.05]);
  pixels = sepia(pixels, 0.3);
  return pixels;
};
const moon = (pixels) => {
  pixels = grayscale(pixels);
  pixels = contrast(pixels, -0.04);
  pixels = brightness(pixels, 0.1);
  return pixels;
};
const willow = (pixels) => {
  pixels = grayscale(pixels);
  pixels = colorFilter(pixels, [100, 28, 210, 0.03]);
  pixels = brightness(pixels, 0.1);
  return pixels;
};
const inkwell = (pixels) => {
  pixels = grayscale(pixels);
  return pixels;
};
const lark = (pixels) => {
  pixels = brightness(pixels, 0.08);
  pixels = rgbAdjust(pixels, [1, 1.03, 1.05]);
  pixels = saturation(pixels, 0.12);
  return pixels;
};
const juno = (pixels) => {
  pixels = rgbAdjust(pixels, [1.01, 1.04, 1]);
  pixels = saturation(pixels, 0.3);
  return pixels;
};
const amaro = (pixels) => {
  pixels = saturation(pixels, 0.3);
  pixels = brightness(pixels, 0.15);
  return pixels;
};
const mayfair = (pixels) => {
  pixels = colorFilter(pixels, [230, 115, 108, 0.05]);
  pixels = saturation(pixels, 0.15);
  return pixels;
};
const rise = (pixels) => {
  pixels = colorFilter(pixels, [255, 170, 0, 0.1]);
  pixels = brightness(pixels, 0.09);
  pixels = saturation(pixels, 0.1);
  return pixels;
};
const valencia = (pixels) => {
  pixels = colorFilter(pixels, [255, 225, 80, 0.08]);
  pixels = saturation(pixels, 0.1);
  pixels = contrast(pixels, 0.05);
  return pixels;
};
const kelvin = (pixels) => {
  pixels = colorFilter(pixels, [255, 140, 0, 0.1]);
  pixels = rgbAdjust(pixels, [1.15, 1.05, 1]);
  pixels = saturation(pixels, 0.35);
  return pixels;
};
const nashville = (pixels) => {
  pixels = colorFilter(pixels, [220, 115, 188, 0.12]);
  pixels = contrast(pixels, -0.05);
  return pixels;
};
const vesper = (pixels) => {
  pixels = colorFilter(pixels, [255, 225, 0, 0.05]);
  pixels = brightness(pixels, 0.06);
  pixels = contrast(pixels, 0.06);
  return pixels;
};
const ashby = (pixels) => {
  pixels = colorFilter(pixels, [255, 160, 25, 0.1]);
  pixels = brightness(pixels, 0.1);
  return pixels;
};
const charmes = (pixels) => {
  pixels = colorFilter(pixels, [255, 50, 80, 0.12]);
  pixels = contrast(pixels, 0.05);
  return pixels;
};
const ginza = (pixels) => {
  pixels = sepia(pixels, 0.06);
  pixels = brightness(pixels, 0.1);
  return pixels;
};
const hudson = (pixels) => {
  pixels = rgbAdjust(pixels, [1, 1, 1.25]);
  pixels = contrast(pixels, 0.1);
  pixels = brightness(pixels, 0.15);
  return pixels;
};
const slumber = (pixels) => {
  pixels = brightness(pixels, 0.1);
  pixels = saturation(pixels, -0.5);
  return pixels;
};
const aden = (pixels) => {
  pixels = colorFilter(pixels, [228, 130, 225, 0.13]);
  pixels = saturation(pixels, -0.2);
  return pixels;
};
const perpetua = (pixels) => {
  pixels = rgbAdjust(pixels, [1.05, 1.1, 1]);
  return pixels;
};
const crema = (pixels) => {
  pixels = rgbAdjust(pixels, [1.04, 1, 1.02]);
  pixels = saturation(pixels, -0.05);
  return pixels;
};
const ludwig = (pixels) => {
  pixels = brightness(pixels, 0.05);
  pixels = saturation(pixels, -0.03);
  return pixels;
};
const xpro2 = (pixels) => {
  pixels = colorFilter(pixels, [255, 255, 0, 0.07]);
  pixels = saturation(pixels, 0.2);
  pixels = contrast(pixels, 0.15);
  return pixels;
};
const lofi = (pixels) => {
  pixels = contrast(pixels, 0.15);
  pixels = saturation(pixels, 0.2);
  return pixels;
};
const hefe = (pixels) => {
  pixels = contrast(pixels, 0.1);
  pixels = saturation(pixels, 0.15);
  return pixels;
};
const brannan = (pixels) => {
  pixels = contrast(pixels, 0.2);
  pixels = colorFilter(pixels, [140, 10, 185, 0.1]);
  return pixels;
};
const sutro = (pixels) => {
  pixels = brightness(pixels, -0.1);
  pixels = saturation(pixels, -0.1);
  return pixels;
};
const skyline = (pixels) => {
  pixels = saturation(pixels, 0.35);
  pixels = brightness(pixels, 0.1);
  return pixels;
};
const dogpatch = (pixels) => {
  pixels = contrast(pixels, 0.15);
  pixels = brightness(pixels, 0.1);
  return pixels;
};
const maven = (pixels) => {
  pixels = colorFilter(pixels, [225, 240, 0, 0.1]);
  pixels = saturation(pixels, 0.25);
  pixels = contrast(pixels, 0.05);
  return pixels;
};
const helena = (pixels) => {
  pixels = colorFilter(pixels, [208, 208, 86, 0.2]);
  pixels = contrast(pixels, 0.15);
  return pixels;
};
const sierra = (pixels) => {
  pixels = contrast(pixels, -0.15);
  pixels = saturation(pixels, 0.1);
  return pixels;
};
const googleStyle = (pixels) => {
  pixels = saturation(pixels, 0.35);
  pixels = contrast(pixels, 0.12);
  pixels = rgbAdjust(pixels, [0.98, 1, 1.12]);
  pixels = brightness(pixels, 0.05);
  pixels = sharpen(pixels, 0.3);
  return pixels;
};
const googlePop = (pixels) => {
  pixels = saturation(pixels, 0.5);
  pixels = contrast(pixels, 0.18);
  pixels = rgbAdjust(pixels, [1.02, 1.05, 1.15]);
  pixels = sharpen(pixels, 0.4);
  return pixels;
};
const googleVivid = (pixels) => {
  pixels = saturation(pixels, 0.6);
  pixels = contrast(pixels, 0.2);
  pixels = rgbAdjust(pixels, [1, 1.02, 1.18]);
  pixels = brightness(pixels, 0.03);
  pixels = sharpen(pixels, 0.5);
  return pixels;
};
const googleNatural = (pixels) => {
  pixels = saturation(pixels, 0.2);
  pixels = contrast(pixels, 0.08);
  pixels = rgbAdjust(pixels, [1, 1.02, 1.08]);
  pixels = sharpen(pixels, 0.2);
  return pixels;
};
const googleHDR = (pixels) => {
  pixels = saturation(pixels, 0.4);
  pixels = contrast(pixels, 0.22);
  pixels = rgbAdjust(pixels, [1.02, 1.04, 1.12]);
  pixels = brightness(pixels, -0.02);
  pixels = sharpen(pixels, 0.35);
  return pixels;
};
const filterPresets = [
  // Original
  { id: "normal", name: "Normal", nameKo: "원본", description: "No filter applied", category: "soft", apply: normal },
  // Google Photos Style (Most Important - First!)
  { id: "google-style", name: "Google Style", nameKo: "구글 스타일", description: "구글 포토 스타일사진 효과", category: "google", apply: googleStyle },
  { id: "google-pop", name: "Google Pop", nameKo: "구글 팝", description: "강렬한 색상 팝 효과", category: "google", apply: googlePop },
  { id: "google-vivid", name: "Google Vivid", nameKo: "구글 비비드", description: "극대화된 색상 강화", category: "google", apply: googleVivid },
  { id: "google-natural", name: "Google Natural", nameKo: "구글 내추럴", description: "자연스러운 색상 향상", category: "google", apply: googleNatural },
  { id: "google-hdr", name: "Google HDR", nameKo: "구글 HDR", description: "HDR 효과로 다이나믹한 느낌", category: "google", apply: googleHDR },
  // Vintage & Retro
  { id: "clarendon", name: "Clarendon", nameKo: "클라렌돈", description: "Light to lighter, dark to darker", category: "vintage", apply: clarendon },
  { id: "gingham", name: "Gingham", nameKo: "깅엄", description: "Vintage-inspired, muted colors", category: "vintage", apply: gingham },
  { id: "reyes", name: "Reyes", nameKo: "레예스", description: "Dusty vintage look", category: "vintage", apply: reyes },
  { id: "stinson", name: "Stinson", nameKo: "스틴슨", description: "Washed out colors", category: "vintage", apply: stinson },
  { id: "earlybird", name: "Earlybird", nameKo: "얼리버드", description: "Sepia tint, warm temperature", category: "vintage", apply: earlybird },
  { id: "toaster", name: "Toaster", nameKo: "토스터", description: "Aged look with dramatic vignette", category: "vintage", apply: toaster },
  { id: "walden", name: "Walden", nameKo: "월든", description: "Increased exposure, yellow tint", category: "vintage", apply: walden },
  { id: "1977", name: "1977", nameKo: "1977", description: "Rosy, brighter, faded look", category: "vintage", apply: f1977 },
  { id: "brooklyn", name: "Brooklyn", nameKo: "브루클린", description: "Cool tint with sepia", category: "vintage", apply: brooklyn },
  // Black & White
  { id: "moon", name: "Moon", nameKo: "문", description: "B/W with increased brightness", category: "bw", apply: moon },
  { id: "willow", name: "Willow", nameKo: "윌로우", description: "Monochromatic with purple tones", category: "bw", apply: willow },
  { id: "inkwell", name: "Inkwell", nameKo: "잉크웰", description: "Classic black and white", category: "bw", apply: inkwell },
  // Warm Tones
  { id: "lark", name: "Lark", nameKo: "라크", description: "Brightens and intensifies colors", category: "warm", apply: lark },
  { id: "juno", name: "Juno", nameKo: "주노", description: "Intensifies red and yellow hues", category: "warm", apply: juno },
  { id: "amaro", name: "Amaro", nameKo: "아마로", description: "Adds light with center focus", category: "warm", apply: amaro },
  { id: "mayfair", name: "Mayfair", nameKo: "메이페어", description: "Warm pink tone", category: "warm", apply: mayfair },
  { id: "rise", name: "Rise", nameKo: "라이즈", description: "Glow with softer lighting", category: "warm", apply: rise },
  { id: "valencia", name: "Valencia", nameKo: "발렌시아", description: "Antique feel, warm colors", category: "warm", apply: valencia },
  { id: "kelvin", name: "Kelvin", nameKo: "켈빈", description: "Radiant glow, high saturation", category: "warm", apply: kelvin },
  { id: "nashville", name: "Nashville", nameKo: "내슈빌", description: "Nostalgic pink tint", category: "warm", apply: nashville },
  { id: "vesper", name: "Vesper", nameKo: "베스퍼", description: "Subtle yellow tint", category: "warm", apply: vesper },
  { id: "ashby", name: "Ashby", nameKo: "애시비", description: "Golden glow, vintage feel", category: "warm", apply: ashby },
  { id: "charmes", name: "Charmes", nameKo: "샤름", description: "High contrast, red tint", category: "warm", apply: charmes },
  { id: "ginza", name: "Ginza", nameKo: "긴자", description: "Bright with warm glow", category: "warm", apply: ginza },
  // Cool Tones
  { id: "hudson", name: "Hudson", nameKo: "허드슨", description: "Icy illusion, cool tint", category: "cool", apply: hudson },
  { id: "slumber", name: "Slumber", nameKo: "슬럼버", description: "Dreamy, desaturated look", category: "cool", apply: slumber },
  { id: "aden", name: "Aden", nameKo: "에이든", description: "Blue/pink natural look", category: "cool", apply: aden },
  { id: "perpetua", name: "Perpetua", nameKo: "퍼페츄아", description: "Pastel look for portraits", category: "cool", apply: perpetua },
  { id: "crema", name: "Crema", nameKo: "크레마", description: "Creamy, balanced tones", category: "cool", apply: crema },
  { id: "ludwig", name: "Ludwig", nameKo: "루드비히", description: "Subtle desaturation", category: "cool", apply: ludwig },
  // High Contrast / Vivid
  { id: "xpro2", name: "X-Pro II", nameKo: "엑스프로 II", description: "Vibrant with golden tint", category: "vivid", apply: xpro2 },
  { id: "lofi", name: "Lo-Fi", nameKo: "로파이", description: "Rich color, strong shadows", category: "vivid", apply: lofi },
  { id: "hefe", name: "Hefe", nameKo: "헤페", description: "High contrast and saturation", category: "vivid", apply: hefe },
  { id: "brannan", name: "Brannan", nameKo: "브래넌", description: "High contrast, metallic tint", category: "vivid", apply: brannan },
  { id: "sutro", name: "Sutro", nameKo: "수트로", description: "Dark edges, dramatic shadows", category: "vivid", apply: sutro },
  { id: "skyline", name: "Skyline", nameKo: "스카이라인", description: "Bright and vivid", category: "vivid", apply: skyline },
  { id: "dogpatch", name: "Dogpatch", nameKo: "독패치", description: "High contrast, washed highlights", category: "vivid", apply: dogpatch },
  { id: "maven", name: "Maven", nameKo: "메이븐", description: "Dark with yellow tint", category: "vivid", apply: maven },
  { id: "helena", name: "Helena", nameKo: "헬레나", description: "Orange and teal vibe", category: "vivid", apply: helena },
  // Soft / Faded
  { id: "sierra", name: "Sierra", nameKo: "시에라", description: "Faded, softer look", category: "soft", apply: sierra }
];
const filterCategories = {
  google: { name: "Google Style", nameKo: "구글 스타일" },
  vintage: { name: "Vintage", nameKo: "빈티지" },
  bw: { name: "Black & White", nameKo: "흑백" },
  warm: { name: "Warm", nameKo: "따뜻한 톤" },
  cool: { name: "Cool", nameKo: "차가운 톤" },
  vivid: { name: "Vivid", nameKo: "선명한" },
  soft: { name: "Soft", nameKo: "부드러운" },
  artistic: { name: "Artistic", nameKo: "아티스틱" }
};
function getFilterById(id) {
  return filterPresets.find((f) => f.id === id);
}
const imageStyles = filterPresets.map((preset) => ({
  id: preset.id,
  name: preset.name,
  nameKo: preset.nameKo,
  description: preset.description,
  category: preset.category,
  apply: preset.apply
}));
async function applyFilterToImage(imageUrl, filterId, strength = 1) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (filterId !== "normal") {
          const filter = getFilterById(filterId);
          if (filter) {
            if (strength < 1) {
              const originalData = new Uint8ClampedArray(imageData.data);
              filter.apply(imageData);
              for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = originalData[i] * (1 - strength) + imageData.data[i] * strength;
                imageData.data[i + 1] = originalData[i + 1] * (1 - strength) + imageData.data[i + 1] * strength;
                imageData.data[i + 2] = originalData[i + 2] * (1 - strength) + imageData.data[i + 2] * strength;
              }
            } else {
              filter.apply(imageData);
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve(url);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          "image/jpeg",
          0.95
        );
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = imageUrl;
  });
}
async function generateFilterThumbnail(imageUrl, filterId, size = 100) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }
        const aspectRatio = img.width / img.height;
        let width = size;
        let height = size;
        if (aspectRatio > 1) {
          height = size / aspectRatio;
        } else {
          width = size * aspectRatio;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        if (filterId !== "normal") {
          const filter = getFilterById(filterId);
          if (filter) {
            filter.apply(imageData);
          }
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = imageUrl;
  });
}
function downloadImage(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function revokeImageUrl(url) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
function StyleSelector({
  selectedStyle,
  onStyleSelect,
  previewImage,
  onStrengthChange
}) {
  var _a;
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [thumbnails, setThumbnails] = useState({});
  const [strength, setStrength] = useState(100);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);
  const filteredStyles = useMemo(() => {
    if (selectedCategory === "all") return imageStyles;
    return imageStyles.filter((style) => style.category === selectedCategory);
  }, [selectedCategory]);
  useEffect(() => {
    if (!previewImage) return;
    let isCancelled = false;
    setIsGeneratingThumbnails(true);
    const generateThumbnails = async () => {
      const newThumbnails = {};
      const batchSize = 6;
      for (let i = 0; i < imageStyles.length; i += batchSize) {
        if (isCancelled) break;
        const batch = imageStyles.slice(i, i + batchSize);
        const promises = batch.map(async (style) => {
          try {
            const thumbnail = await generateFilterThumbnail(previewImage, style.id, 150);
            return { id: style.id, thumbnail };
          } catch (error) {
            console.error(`Failed to generate thumbnail for ${style.id}:`, error);
            return { id: style.id, thumbnail: "" };
          }
        });
        const results = await Promise.all(promises);
        results.forEach(({ id, thumbnail }) => {
          if (thumbnail) {
            newThumbnails[id] = thumbnail;
          }
        });
        if (!isCancelled) {
          setThumbnails((prev) => ({ ...prev, ...newThumbnails }));
        }
      }
      setIsGeneratingThumbnails(false);
    };
    generateThumbnails();
    return () => {
      isCancelled = true;
    };
  }, [previewImage]);
  const handleStrengthChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10);
    setStrength(value);
    onStrengthChange == null ? void 0 : onStrengthChange(value / 100);
  }, [onStrengthChange]);
  const categoryCounts = useMemo(() => {
    const counts = { all: imageStyles.length };
    imageStyles.forEach((style) => {
      counts[style.category] = (counts[style.category] || 0) + 1;
    });
    return counts;
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "w-full bg-white rounded-xl shadow-lg p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Choose a style" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [
          "40+ Instagram style filter (",
          filteredStyles.length,
          "개 표시)"
        ] })
      ] }),
      selectedStyle.id !== "normal" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-600 whitespace-nowrap", children: "필터 강도" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "range",
            min: "0",
            max: "100",
            value: strength,
            onChange: handleStrengthChange,
            className: "w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-blue-600 w-10", children: [
          strength,
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-200", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedCategory("all"),
          className: `px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === "all" ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
          children: [
            "entire (",
            categoryCounts.all,
            ")"
          ]
        }
      ),
      Object.keys(filterCategories).map((category) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedCategory(category),
          className: `px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
          children: [
            filterCategories[category].nameKo,
            " (",
            categoryCounts[category] || 0,
            ")"
          ]
        },
        category
      ))
    ] }),
    isGeneratingThumbnails && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500 mb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" }),
      /* @__PURE__ */ jsx("span", { children: "썸네일 생성 중..." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3", children: filteredStyles.map((style) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onStyleSelect(style),
        className: `group relative rounded-xl overflow-hidden transition-all duration-200 ${selectedStyle.id === style.id ? "ring-4 ring-blue-500 ring-offset-2 transform scale-[1.03] shadow-lg" : "hover:ring-2 hover:ring-gray-300 hover:transform hover:scale-[1.02] hover:shadow-md"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "aspect-square bg-gray-100 relative overflow-hidden", children: [
            thumbnails[style.id] ? /* @__PURE__ */ jsx(
              "img",
              {
                src: thumbnails[style.id],
                alt: style.nameKo,
                className: "w-full h-full object-cover",
                loading: "lazy"
              }
            ) : previewImage ? /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-pulse bg-gray-200 w-full h-full" }) }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-16 h-16 rounded-lg shadow-inner",
                style: {
                  background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
                }
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" }),
            selectedStyle.id === style.id && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-white", children: /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-800 truncate text-center", children: style.nameKo }) })
        ]
      },
      style.id
    )) }) }),
    selectedStyle.id !== "normal" && /* @__PURE__ */ jsx("div", { className: "mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md", children: thumbnails[selectedStyle.id] ? /* @__PURE__ */ jsx(
        "img",
        {
          src: thumbnails[selectedStyle.id],
          alt: selectedStyle.nameKo,
          className: "w-full h-full object-cover"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gray-200 animate-pulse" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-gray-800", children: [
          selectedStyle.nameKo,
          /* @__PURE__ */ jsxs("span", { className: "ml-2 text-sm font-normal text-gray-500", children: [
            "(",
            selectedStyle.name,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: selectedStyle.description }),
        /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: ((_a = filterCategories[selectedStyle.category]) == null ? void 0 : _a.nameKo) || selectedStyle.category }) })
      ] })
    ] }) })
  ] });
}
function ImagePreview({
  originalImage,
  selectedStyle,
  fileName,
  strength = 1
}) {
  const [processedImage, setProcessedImage] = useState(originalImage);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const previousProcessedUrl = useRef("");
  useEffect(() => {
    let isCancelled = false;
    const processImage = async () => {
      if (selectedStyle.id === "normal") {
        setProcessedImage(originalImage);
        return;
      }
      setIsProcessing(true);
      try {
        const processed = await applyFilterToImage(originalImage, selectedStyle.id, strength);
        if (!isCancelled) {
          if (previousProcessedUrl.current && previousProcessedUrl.current.startsWith("blob:")) {
            revokeImageUrl(previousProcessedUrl.current);
          }
          previousProcessedUrl.current = processed;
          setProcessedImage(processed);
        } else {
          revokeImageUrl(processed);
        }
      } catch (error) {
        console.error("Failed to process image:", error);
      } finally {
        if (!isCancelled) {
          setIsProcessing(false);
        }
      }
    };
    processImage();
    return () => {
      isCancelled = true;
    };
  }, [originalImage, selectedStyle, strength]);
  useEffect(() => {
    return () => {
      if (previousProcessedUrl.current && previousProcessedUrl.current.startsWith("blob:")) {
        revokeImageUrl(previousProcessedUrl.current);
      }
    };
  }, []);
  const handleDownload = () => {
    const extension = fileName.split(".").pop() || "jpg";
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    const strengthSuffix = strength < 1 ? `_${Math.round(strength * 100)}` : "";
    const newFileName = `${baseName}_${selectedStyle.id}${strengthSuffix}.${extension}`;
    downloadImage(processedImage, newFileName);
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Preview" }),
        selectedStyle.id !== "normal" && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [
          selectedStyle.nameKo,
          " (",
          Math.round(strength * 100),
          "% 강도)"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowComparison(!showComparison),
            className: "px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" }) }),
              showComparison ? "단일 보기" : "비교 보기"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleDownload,
            disabled: isProcessing,
            className: "px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }),
              "다운로드"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-auto max-h-[80vh]", children: [
      isProcessing && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-16 h-16 mx-auto mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-gray-200" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 font-medium", children: "Applying filter..." }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mt-1", children: selectedStyle.nameKo })
      ] }) }),
      showComparison ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "overflow-auto", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-2 sticky top-0 bg-white py-1 z-10", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700", children: "text" }) }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center bg-gray-50 rounded-lg p-2", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: originalImage,
              alt: "Original",
              className: "max-w-full h-auto rounded-lg shadow-md object-contain",
              style: { maxHeight: "65vh" }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "overflow-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2 sticky top-0 bg-white py-1 z-10", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700", children: selectedStyle.nameKo }),
            strength < 1 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700", children: [
              Math.round(strength * 100),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center bg-gray-50 rounded-lg p-2", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: processedImage,
              alt: "Processed",
              className: "max-w-full h-auto rounded-lg shadow-md object-contain",
              style: { maxHeight: "65vh" }
            }
          ) })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "relative flex justify-center bg-gray-50 rounded-lg p-2", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: processedImage,
            alt: "Preview",
            className: "max-w-full h-auto rounded-lg shadow-md object-contain",
            style: { maxHeight: "75vh" }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg", children: selectedStyle.nameKo }),
          strength < 1 && selectedStyle.id !== "normal" && /* @__PURE__ */ jsxs("span", { className: "bg-purple-600/90 text-white px-2.5 py-1.5 rounded-full text-xs font-medium shadow-lg", children: [
            Math.round(strength * 100),
            "%"
          ] })
        ] })
      ] })
    ] }),
    selectedStyle.id !== "normal" && /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100", children: /* @__PURE__ */ jsx("div", { className: "flex items-start gap-3", children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-gray-800", children: [
        selectedStyle.nameKo,
        /* @__PURE__ */ jsxs("span", { className: "ml-2 text-sm font-normal text-gray-500", children: [
          "(",
          selectedStyle.name,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: selectedStyle.description })
    ] }) }) })
  ] }) });
}
const meta = () => {
  return [
    { title: "Photo Style - Convert photo style" },
    { name: "description", content: "40+ Instagram Transform your photos with style filters" }
  ];
};
function Index() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(imageStyles[0]);
  const [filterStrength, setFilterStrength] = useState(1);
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a;
      setUploadedImage((_a = e.target) == null ? void 0 : _a.result);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };
  const handleReset = () => {
    setUploadedImage(null);
    setFileName("");
    setSelectedStyle(imageStyles[0]);
    setFilterStrength(1);
  };
  const handleStrengthChange = useCallback((strength) => {
    setFilterStrength(strength);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto flex items-center justify-center gap-6 text-sm font-medium", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg", children: "🔒" }),
        /* @__PURE__ */ jsx("span", { children: "100% Browser-based processing" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg", children: "🛡️" }),
        /* @__PURE__ */ jsx("span", { children: "No image storage on server" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg", children: "✅" }),
        /* @__PURE__ */ jsx("span", { children: "DB No use" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg", children: "🔐" }),
        /* @__PURE__ */ jsx("span", { children: "Complete privacy guaranteed" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("header", { className: "bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Photo Style" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "40+ Instagram Filters" })
        ] })
      ] }),
      uploadedImage && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleReset,
          className: "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" }) }),
            "new image"
          ]
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsx("main", { className: "w-full px-4 sm:px-6 lg:px-8 py-8", children: !uploadedImage ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh]", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-gray-800 mb-4", children: /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent", children: "Apply cool styles to your photos" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600", children: "40+ Instagram You can transform your photos with style filters." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto mb-8 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-6 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-green-900 mb-2", children: "Complete privacy protection" }),
          /* @__PURE__ */ jsxs("ul", { className: "text-sm text-green-800 space-y-1", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
              "All image processing is done exclusively in the browser."
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
              "Images are not sent or stored on the server."
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
              "Doesn't use a database"
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(ImageUploader, { onImageUpload: handleImageUpload }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" }) }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800 mb-2", children: "easy upload" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Upload images easily with drag and drop" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-purple-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" }) }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800 mb-2", children: "40+ styles" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Instagram Style filters and intensity control" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800 mb-2", children: "Instant download" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Save edited images with one click" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsx(
        StyleSelector,
        {
          selectedStyle,
          onStyleSelect: setSelectedStyle,
          previewImage: uploadedImage,
          onStrengthChange: handleStrengthChange
        }
      ),
      /* @__PURE__ */ jsx(
        ImagePreview,
        {
          originalImage: uploadedImage,
          selectedStyle,
          fileName,
          strength: filterStrength
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("footer", { className: "mt-16 border-t border-gray-200 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-xl p-6 mb-6 max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-gray-800 mb-4 text-center flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }),
          "Privacy Policy"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6 text-sm text-gray-600", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx("span", { className: "text-xl", children: "🔒" }) }),
            /* @__PURE__ */ jsx("h4", { className: "font-medium text-gray-800 mb-1", children: "local processing" }),
            /* @__PURE__ */ jsx("p", { children: "All image conversions are processed solely in the user's browser and are not sent to external servers." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx("span", { className: "text-xl", children: "🛡️" }) }),
            /* @__PURE__ */ jsx("h4", { className: "font-medium text-gray-800 mb-1", children: "Data not collected" }),
            /* @__PURE__ */ jsx("p", { children: "We do not collect or store any data, including images, personal information, or usage history." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx("span", { className: "text-xl", children: "✅" }) }),
            /* @__PURE__ */ jsx("h4", { className: "font-medium text-gray-800 mb-1", children: "safe use" }),
            /* @__PURE__ */ jsx("p", { children: "It works without a server connection, so there is no risk of hacking or data leakage." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-gray-500", children: "Made with Remix & Tailwind CSS • 40+ Instagram Style Filters • 100% Privacy Guaranteed" })
    ] }) })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-JlE5XoK5.js", "imports": ["/assets/index-BJHAE5s4.js", "/assets/components-oPy5vcAg.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-aTFf8i9H.js", "imports": ["/assets/index-BJHAE5s4.js", "/assets/components-oPy5vcAg.js"], "css": ["/assets/root-DzeweBfw.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-DnHBfNuR.js", "imports": ["/assets/index-BJHAE5s4.js"], "css": [] } }, "url": "/assets/manifest-ca3bbf7c.js", "version": "ca3bbf7c" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
