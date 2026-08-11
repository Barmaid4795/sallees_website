#!/usr/bin/env python3
"""Local static file server for previewing this site, with caching disabled.

Same as `python3 -m http.server`, except every response carries
`Cache-Control: no-store` so browsers always fetch the live file instead of
silently reusing a stale cached copy while this site is under active edit.
"""

import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    HTTPServer(("0.0.0.0", port), NoCacheHandler).serve_forever()
