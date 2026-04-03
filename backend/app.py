from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
import random
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/InstaMedDB"
app.config["JWT_SECRET_KEY"] = "bhai-ki-secret-key-786"
mongo = PyMongo(app)
jwt = JWTManager(app)

# Helper: Phone number clean karne ke liye
def clean_phone(p): 
    return str(p).replace("+91", "").replace(" ", "").strip()

# --- 1. AUTH: OTP Bhejna ---
@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    phone = clean_phone(request.json.get('phone'))
    otp = str(random.randint(100000, 999999))
    mongo.db.otps.update_one({"phone": phone}, {"$set": {"otp": otp}}, upsert=True)
    print(f"\n🔥 [OTP]: {otp} for {phone}\n")
    return jsonify({"msg": "OTP Sent Successfully"}), 200

# --- 2. AUTH: OTP Verify karna ---
@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    phone = clean_phone(data.get('phone'))
    user_otp = str(data.get('otp')).strip()
    name = data.get('name', 'User')
    
    record = mongo.db.otps.find_one({"phone": phone})
    if record and str(record['otp']) == user_otp:
        # User create ya update karna
        mongo.db.users.update_one({"phone": phone}, {"$set": {"name": name}}, upsert=True)
        token = create_access_token(identity=phone)
        return jsonify({"token": token, "name": name, "status": "ok"}), 200
    return jsonify({"msg": "Invalid OTP"}), 401

# --- 3. HISTORY: Report Save Karna (New) ---
@app.route('/api/save-report', methods=['POST'])
@jwt_required()
def save_report():
    current_user_phone = get_jwt_identity()
    data = request.json # Frontend se report ka data aayega
    
    report = {
        "phone": current_user_phone,
        "fileName": data.get('fileName'),
        "content": data.get('content'),
        "date": datetime.now().strftime("%d/%m/%Y"),
        "time": datetime.now().strftime("%I:%M %p")
    }
    
    mongo.db.reports.insert_one(report)
    return jsonify({"msg": "Report saved to Database"}), 200

# --- 4. HISTORY: Reports Nikalna (New) ---
@app.route('/api/get-history', methods=['GET'])
@jwt_required()
def get_history():
    current_user_phone = get_jwt_identity()
    # User ki sari reports find karna
    reports = list(mongo.db.reports.find({"phone": current_user_phone}, {"_id": 0}))
    return jsonify(reports), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)