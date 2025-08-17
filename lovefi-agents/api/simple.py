from http.server import BaseHTTPRequestHandler
import json
import urllib.parse

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Parse query parameters
        parsed_url = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_url.query)
        
        response = {
            "status": "LoveFi Dating Matcher Agent is running",
            "agent": "lovefi-matcher",
            "endpoint": "/api/simple",
            "method": "GET",
            "timestamp": "2024-08-17",
            "available_endpoints": [
                "/api/test",
                "/api/simple",
                "/api/index"
            ]
        }
        
        self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))
        return

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            # Try to parse JSON data
            try:
                request_data = json.loads(post_data.decode('utf-8')) if post_data else {}
            except json.JSONDecodeError:
                request_data = {"raw_data": post_data.decode('utf-8', errors='ignore')}
            
            response = {
                "status": "POST request received",
                "message": "LoveFi Dating Matcher Agent processed your request",
                "method": "POST",
                "received_data": request_data,
                "agent": "lovefi-matcher"
            }
            
            self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))
            return
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            error_response = {
                "error": "Internal server error",
                "message": str(e),
                "status": "error"
            }
            
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
            return

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return
