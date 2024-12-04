from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
api = Api(app)

class CheckAccount(Resource):
    def post(self):
        account = request.json.get('account')
        if not account:
            return {'result': 0, 'message': 'Missing account parameter.'}, 400
        
        # For testing purposes, we'll consider any account ending with "test" as existing
        if account.lower().endswith('test'):
            return {'result': 0, 'message': 'Account already exists.'}
        else:
            return {'result': 1, 'message': 'Account is available.'}

class Register(Resource):
    def post(self):
        user_data = request.json
        required_fields = ['name', 'sex', 'account', 'password', 'email', 'phone', 'address']
        
        if not all(user_data.get(field) for field in required_fields):
            return {'result': 0, 'message': 'Missing required fields.'}, 400
        
        # For testing purposes, we'll consider the registration successful
        return {'result': '申請成功', 'message': f"User {user_data['name']} registered successfully."}

api.add_resource(CheckAccount, '/check-account')
api.add_resource(Register, '/register')

if __name__ == '__main__':
    print("Flask server running on http://127.0.0.1:4998")
    app.run(debug=True, port=4998)
