def handler(request, context):
    """
    Simple Vercel serverless function
    """
    try:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '''{"status": "LoveFi Dating Matcher Agent is running", "agent": "lovefi-matcher", "message": "API endpoint working perfectly", "endpoint": "/api/test"}'''
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': f'{{"error": "Internal server error", "message": "{str(e)}"}}'
        }
