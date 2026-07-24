from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


SITE_ROOT = Path(__file__).resolve().parent
GENERATED_ASSET_DIR = Path(
    "/Users/sophiezhou/.cursor/projects/"
    "Users-sophiezhou-Development-personal-website/assets"
)
FLOWER_ASSET = GENERATED_ASSET_DIR / "pressed-wildflowers-paper.png"


class PortfolioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE_ROOT), **kwargs)

    def do_GET(self):
        request_path = self.path.split("?", 1)[0]
        if request_path.startswith("/assets/generated/"):
            filename = Path(request_path).name
            asset = GENERATED_ASSET_DIR / filename
            if not asset.exists() or asset.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
                self.send_error(404, "Generated asset not found")
                return

            contents = asset.read_bytes()
            self.send_response(200)
            content_type = "image/png" if asset.suffix.lower() == ".png" else "image/jpeg"
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(contents)))
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(contents)
            return

        if request_path == "/assets/pressed-wildflowers-paper.png":
            self.path = "/assets/generated/pressed-wildflowers-paper.png"
            self.do_GET()
            return

        super().do_GET()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 5173), PortfolioHandler)
    print("Portfolio available at http://127.0.0.1:5173", flush=True)
    server.serve_forever()
