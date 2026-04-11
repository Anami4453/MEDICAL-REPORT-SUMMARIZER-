from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
import random
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv() # .env file se DATABASE_URL read karega

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/InstaMedDB"
app.config["JWT_SECRET_KEY"] = "bhai-ki-secret-key-786"
mongo = PyMongo(app)
jwt = JWTManager(app)

# --- SUPABASE CONNECTION FUNCTION (Updated with Name, Phone & Status) ---
def save_to_supabase(name, phone, file_name, content, health_status):
    try:
        conn = psycopg2.connect(os.getenv("DATABASE_URL"))
        cur = conn.cursor()
        
        # Query: Ab hum saari details bhej rahe hain
        query = """
        INSERT INTO medical_reports (patient_name, phone_number, original_text, summary, health_status)
        VALUES (%s, %s, %s, %s, %s);
        """
        cur.execute(query, (name, phone, file_name, content, health_status))
        
        conn.commit()
        cur.close()
        conn.close()
        print(f"✅ Data saved to Supabase for {name} (Status: {health_status})")
    except Exception as e:
        print(f"❌ Supabase Error: {e}")

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
        # MongoDB mein user ka naam aur phone save/update karna
        mongo.db.users.update_one({"phone": phone}, {"$set": {"name": name}}, upsert=True)
        token = create_access_token(identity=phone)
        return jsonify({"token": token, "name": name, "status": "ok"}), 200
    return jsonify({"msg": "Invalid OTP"}), 401

# --- 3. HISTORY: Report Save Karna (With User Profile & Health Status) ---
@app.route('/api/save-report', methods=['POST'])
@jwt_required()
def save_report():
    current_user_phone = get_jwt_identity()
    data = request.json 
    
    # 1. MongoDB se User ka Naam nikalna
    user_record = mongo.db.users.find_one({"phone": current_user_phone})
    user_name = user_record.get('name', 'Unknown User') if user_record else 'Unknown User'
    
    file_name = data.get('fileName')
    content = data.get('content')
    
    # 2. SIMPLE AI LOGIC: Health Status (Good/Bad) check karna
    # Hum keywords check kar rahe hain content ke andar
    report_text_lower = content.lower()
    bad_keywords = ['pneumonia', 'infection', 'abnormal', 'fracture', 'positive', 'high level', 'severe']
    
    health_status = "Good (Normal)" # Default
    for word in bad_keywords:
        if word in report_text_lower:
            health_status = "Bad (Needs Attention)"
            break

    # 3. Local MongoDB Report Object
    report = {
        "phone": current_user_phone,
        "patientName": user_name,
        "fileName": file_name,
        "content": content,
        "healthStatus": health_status,
        "date": datetime.now().strftime("%d/%m/%Y"),
        "time": datetime.now().strftime("%I:%M %p")
    }
    
    # MongoDB mein save karein
    mongo.db.reports.insert_one(report)
    
    # 4. Cloud Supabase mein poori detail save karein
    save_to_supabase(user_name, current_user_phone, file_name, content, health_status)
    
    return jsonify({
        "msg": "Report saved successfully",
        "health_status": health_status
    }), 200

# --- 4. HISTORY: Reports Nikalna ---
@app.route('/api/get-history', methods=['GET'])
@jwt_required()
def get_history():
    current_user_phone = get_jwt_identity()
    reports = list(mongo.db.reports.find({"phone": current_user_phone}, {"_id": 0}))
    return jsonify(reports), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)