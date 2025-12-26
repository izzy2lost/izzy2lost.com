import argparse
import errno
import http.server


class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


class ReusableThreadingHTTPServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True


def serve(host: str, preferred_port: int, auto_port: bool) -> None:
    candidate_ports = [preferred_port]
    if auto_port:
        candidate_ports.extend(range(preferred_port + 1, preferred_port + 50))

    last_error: OSError | None = None
    for port in candidate_ports:
        try:
            with ReusableThreadingHTTPServer((host, port), NoCacheHTTPRequestHandler) as httpd:
                print(f"Server running at http://{host}:{port}/", flush=True)
                httpd.serve_forever()
            return
        except OSError as exc:
            last_error = exc
            if auto_port and exc.errno in (errno.EADDRINUSE, 10048):
                continue
            raise

    message = f"Could not bind to {host}:{preferred_port}"
    if auto_port:
        message += " (and nearby ports)"
    if last_error is not None:
        message += f": {last_error}"
    raise SystemExit(message)


def main() -> None:
    parser = argparse.ArgumentParser(description="Local dev server (no-cache headers).")
    parser.add_argument("--host", default="localhost", help="Host/interface to bind (default: localhost)")
    parser.add_argument("--port", type=int, default=5500, help="Preferred port (default: 5500)")
    parser.add_argument(
        "--no-auto-port",
        action="store_true",
        help="Do not try a different port if the preferred port is in use.",
    )
    args = parser.parse_args()
    serve(args.host, args.port, auto_port=not args.no_auto_port)


if __name__ == "__main__":
    main()
