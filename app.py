from flask import Flask, request, jsonify, send_from_directory
from flask_restful import Api, Resource
from flask_cors import CORS
import random

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

@app.route('/sales_report')
def sales_report():
    return app.send_static_file('sales_report.html')

@app.route('/sales_report', methods=['POST'])
def get_sales_report():
    data = request.json
    print(data)
    report_type = data.get('type')
    periods = data.get('periods')
    day_of_week = data.get('day_of_week')

    if report_type not in ['day', 'week', 'month'] or not isinstance(periods, int) or periods < 1 or periods > 10:
        return jsonify({"error": "Invalid input parameters"}), 400

    # Mock data generation based on report type and periods
    response_data = []
    for _ in range(periods):
        total_value = round(1000 + random.uniform(-50, 50), 2)
        total_quantity = round(50 + random.uniform(-5, 5), 2)
        response_data.append({
            "total_value": total_value,
            "total_quantity": total_quantity
        })
    print(response_data)

    return jsonify({"type": report_type, "data": response_data})


if __name__ == '__main__':
    print("Flask server running on http://127.0.0.1:4998")
    app.run(debug=True, port=5000)
