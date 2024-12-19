from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# Mock data structures
users = {
    "1": {
        "name": "John Doe",
        "email": "john@example.com",
        "address": "123 Main St, City",
        "phone": "1234567890",
        "sex": "男",
        "account": "johndoe",
        "password": "123"
    }
}

credit_cards = {
    "1": [
        {"number": "1234567890123456", "cvv": "123"},
        {"number": "9876543210987654", "cvv": "456"}
    ]
}

@app.route('/getUserImformation', methods=['POST'])
def get_user_information():
    user_id = request.json.get('userId')
    if user_id in users:
        user_info = users[user_id]
        credit_card_info = credit_cards.get(user_id, [])
        return jsonify({
            "result": [
                [user_info['name'], user_info['email'], user_info['address'], user_info['phone'], user_info['sex'], user_info['account'], user_info['password']],
                [[card['number'], card['cvv']] for card in credit_card_info]
            ]
        })
    return jsonify({"error": "User not found"}), 404

@app.route('/updateUserInformation', methods=['POST'])
def update_user_information():
    user_id = request.json.get('userId')
    if user_id in users:
        users[user_id].update({
            "name": request.json.get('name'),
            "email": request.json.get('email'),
            "address": request.json.get('address'),
            "phone": request.json.get('phone'),
            "sex": request.json.get('sex'),
            "password": request.json.get('password')
        })
        return jsonify({"result": True})
    return jsonify({"error": "User not found"}), 404

@app.route('/addCreditCard', methods=['POST'])
def add_credit_card():
    user_id = request.json.get('userId')
    card_number = request.json.get('cardNumber')
    cvv = request.json.get('cvv')
    if user_id in users:
        if user_id not in credit_cards:
            credit_cards[user_id] = []
        credit_cards[user_id].append({"number": card_number, "cvv": cvv})
        return jsonify({"result": True})
    return jsonify({"error": "User not found"}), 404

@app.route('/deleteCreditCard', methods=['POST'])
def delete_credit_card():
    user_id = request.json.get('userId')
    card_number = request.json.get('cardNumber')
    if user_id in credit_cards:
        credit_cards[user_id] = [card for card in credit_cards[user_id] if card['number'] != card_number]
        return jsonify({"result": True})
    return jsonify({"error": "User not found or no credit cards"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
