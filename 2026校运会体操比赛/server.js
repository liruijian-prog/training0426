import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");

loadEnvFile(path.join(__dirname, ".env"));
loadEnvFile(path.join(__dirname, ".env.local"));

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  try {
    if (req.method === "GET" && requestUrl.pathname === "/health") {
      return sendJson(res, 200, {
        ok: true,
        name: "sports-creative-platform",
      });
    }

    if (req.method === "GET") {
      return serveStaticFile(requestUrl.pathname, res);
    }

    return sendJson(res, 405, {
      error: "Method not allowed.",
    });
  } catch (error) {
    console.error("Unhandled server error:", error);
    return sendJson(res, 500, {
      error: "Internal server error.",
    });
  }
});

server.listen(port, host, () => {
  console.log(`Sports creative platform running at http://${host}:${port}`);
});

async function serveStaticFile(rawPath, res) {
  const pathname = rawPath === "/" ? "/index.html" : rawPath;
  const normalized = path.normalize(path.join(publicDir, pathname));

  if (!normalized.startsWith(publicDir)) {
    return sendJson(res, 403, {
      error: "Forbidden.",
    });
  }

  if (!existsSync(normalized)) {
    return sendJson(res, 404, {
      error: "Not found.",
    });
  }

  const fileStats = await stat(normalized);

  if (!fileStats.isFile()) {
    return sendJson(res, 404, {
      error: "Not found.",
    });
  }

  const ext = path.extname(normalized).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";
  const file = await readFile(normalized);

  res.writeHead(200, {
    "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=300",
    "Content-Type": contentType,
  });
  res.end(file);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const normalized = line.startsWith("export ") ? line.slice(7) : line;
    const separatorIndex = normalized.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = normalized.slice(0, separatorIndex).trim();
    let value = normalized.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}
