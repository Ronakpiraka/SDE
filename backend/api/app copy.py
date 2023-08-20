import ssl
from pymongo import MongoClient
from flask import Flask, json, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Apply CORS to the app

# MongoDB connection
# client = MongoClient("mongodb+srv://admin:simplepassword@cluster0.hauzbe5.mongodb.net/healthcaredb?retryWrites=true&w=majority")
# client = MongoClient("mongodb+srv://admin:simplepassword@cluster0.hauzbe5.mongodb.net/?retryWrites=true&w=majority")
# client = MongoClient('localhost', 27017)
client = MongoClient('mongodb://localhost:27017/')
db = client["healthcaredb"]
# print(client)
# print("db is here", list(db['sampledata'].find()))
# ... (fetch_and_store_data and get_age_range functions remain the same)

# def fetch_and_store_data():
#     fetched_data = list(db['sampledata'].find())  # Fetch all documents from the 'premium_data' collection
    
#     # Store fetched data locally as JSON file
#     with open('fetched_data.json', 'w') as json_file:
#         json.dump(fetched_data, json_file)
    
#     return jsonify({"message": "Data fetched and stored locally"})

def get_age_range(age):
    # Define the age ranges and map the age to the appropriate range
    age_ranges = [
        (18, 24), (25, 35), (36, 40), (41, 45),
        (46, 50), (51, 55), (55, 60), (61, 65),
        (65, 70), (70, 75), (76, 90)
    ]
    
    for lower, upper in age_ranges:
        if lower <= age <= upper:
            return f"{lower}-{upper}"
    return None

# @app.route('/', methods = ['GET'])
# def home_page():
#     print("hi we are here")
#     return render_template("index.html")

@app.route('/api/fetch-data', methods=['GET'])
def fetch_data():
    # print("inside of fetch data")
    fetched_data = db['sampledata2'].find()
    abc = []
    for doc in fetched_data:
        try:
            abc.append({ 
                '500000':  doc['500000'] , 
                '700000':  doc['700000'] , 
                '1000000':  doc['1000000'] , 
                '1500000':  doc['1500000'] , 
                '2000000':  doc['2000000'] , 
                '2500000':  doc['2500000'] , 
                '3000000':  doc['3000000'] , 
                '4000000':  doc['4000000'] , 
                '5000000':  doc['5000000'] , 
                '6000000':  doc['6000000'] , 
                '7500000':  doc['7500000'] , 
                'member_csv':  doc['member_csv'] , 
                'age_range':  doc['age_range'] ,
                'tier':  doc['tier'] 
            })
        except:
            print(doc)
    json_data = jsonify(abc)
    return json_data



@app.route('/api/calculate-premium', methods=['POST'])
def calculate_premium():
    data = request.json
    numAdults = data['numAdults']
    numChildren = data['numChildren']
    ages = data['ages']
    cityTier = data['cityTier']
    coverage = data['coverage']

    # Fetch data from MongoDB
    premium_data = db['sampledata']
    
    # Calculate premium based on conditions
    calculated_premiums = []

    for age in ages:
        age_int = int(age)
        age_range = get_age_range(age_int)
        
        member_csv = f"{numAdults}a,{numChildren}c"
        
        for entry in premium_data.find({"member_csv": member_csv, "age_range": age_range, "tier": cityTier}):
            if entry['coverage'] == coverage:
                calculated_premium = entry['premium']
                if age_int != max(ages):
                    calculated_premium *= 0.5
                calculated_premiums.append(calculated_premium)
                break
    
    return jsonify({"premiums": calculated_premiums})

if __name__ == '__main__':
    app.run(debug=True)
