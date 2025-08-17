from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            "status": "LoveFi Dating Matcher Agent is running",
            "agent": "lovefi-matcher",
            "version": "1.0.0",
            "endpoint": "/api/index",
            "description": "AI-powered dating compatibility analyzer",
            "available_methods": ["GET", "POST"],
            "documentation": "Send POST with profile1 and profile2 to get compatibility analysis"
        }
        
        self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))
        return

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length) if content_length > 0 else b''
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            # Parse request data
            request_data = {}
            if post_data:
                try:
                    request_data = json.loads(post_data.decode('utf-8'))
                except json.JSONDecodeError:
                    request_data = {"raw_data": post_data.decode('utf-8', errors='ignore')}
            
            # Simple compatibility analysis
            if 'profile1' in request_data and 'profile2' in request_data:
                profile1 = request_data['profile1']
                profile2 = request_data['profile2']
                
                # Basic compatibility calculation
                score = self.calculate_compatibility(profile1, profile2)
                
                response = {
                    "status": "compatibility_analyzed",
                    "score": score,
                    "explanation": f"Compatibility score: {score}/100",
                    "agent": "lovefi-matcher",
                    "profiles_analyzed": True
                }
            else:
                response = {
                    "status": "data_received",
                    "message": "POST request processed successfully",
                    "agent": "lovefi-matcher",
                    "note": "Send profile1 and profile2 for compatibility analysis",
                    "received_keys": list(request_data.keys())
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
                "status": "error",
                "agent": "lovefi-matcher"
            }
            
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
            return

    def calculate_compatibility(self, profile1, profile2):
        """Simple compatibility calculation"""
        score = 50  # Base score
        
        # Age compatibility
        age1 = profile1.get('age', 25)
        age2 = profile2.get('age', 25)
        age_diff = abs(age1 - age2)
        if age_diff <= 5:
            score += 20
        elif age_diff <= 10:
            score += 10
        
        # Interest overlap
        interests1 = set(profile1.get('interests', []))
        interests2 = set(profile2.get('interests', []))
        common_interests = len(interests1 & interests2)
        score += min(common_interests * 5, 25)
        
        # Location compatibility
        loc1 = profile1.get('location', '').lower()
        loc2 = profile2.get('location', '').lower()
        if loc1 == loc2:
            score += 15
        elif any(city in loc1 and city in loc2 for city in ['new york', 'los angeles', 'chicago']):
            score += 10
        
        return max(0, min(100, score))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return
