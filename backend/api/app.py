
from pymongo import MongoClient
from flask import Flask, json, request, jsonify
from flask_cors import CORS
import certifi
ca = certifi.where()
app = Flask(__name__)
CORS(app)  # Apply CORS to the app

client = MongoClient('mongodb+srv://admin:simplepassword@cluster0.hauzbe5.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
# client = MongoClient('mongodb://localhost:27017/')
db = client["healthcaredb"]
collectionname = 'sampledata'

@app.route('/api/fetchrange', methods=['GET'])
def get_age_range(age):

    fetched_data = db[collectionname].find()
    unique_age_ranges = []

    for doc in fetched_data:
        try:
            age_range = doc['age_range']
            if age_range not in unique_age_ranges:
                unique_age_ranges.append(age_range)
        except:
            print(doc)

    # print("unique_age_group",unique_age_ranges)
    
    # age_ranges = []
    for doc in unique_age_ranges:
        # print('doc', doc)
        range_lower, range_upper = doc.split("-")
        # print("age is", age, "lower ",range_lower,"upper", range_upper )
        if (age>=int(range_lower) and  age<=int(range_upper)):
            # print("age is", age, "lower ",range_lower,"upper", range_upper )
            return f'{range_lower}-{range_upper}'
        # else:
        #     return 0,0


# @app.route('/', methods = ['GET'])
# def home_page():
#     print("hi we are here")
#     return render_template("index.html")
# @app.route ('/')
# def home():

@app.route('/api/fetch-data', methods=['GET'])
def fetch_data():
    print("inside of fetch data")
    fetched_data = db[collectionname].find()
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
    if (numChildren == 0):
        member_csv = f"{numAdults}a"
    else:
        member_csv = f"{numAdults}a,{numChildren}c"
    cityTier = data['cityTier']
    coverage = data['coverage']
    ages = data['ages']
    
    premiums = []  # List to store premiums
    
    fetched_data = db[collectionname].find()  # Fetch data from MongoDB collection
    
    for age in ages:
        age_range = get_age_range(int(age))
        # print(age_range)
        if age_range is not None:
            for entry in fetched_data:
                if 'member_csv' in entry and 'age_range' in entry and 'tier' in entry:
                    if entry['member_csv'] == member_csv and entry['age_range'] == age_range and entry['tier'] == cityTier:
                        premium = entry.get(coverage, 0)  # Retrieve premium based on coverage value or default to 0
                        premiums.append((age, premium))
                        break  # Exit loop once found
        else:
            print("Age range is unavailable for age:", age)
            premiums.append((age, 0))  # Add age with premium 0
    return jsonify(premiums)


if __name__ == '__main__':
    app.run(debug=True)
