# Load the model
import pickle
# from sklearn.ensemble import RandomForestClassifier
with open('rf_model.pkl', 'rb') as f:
    loaded_model = pickle.load(f)
new_data = [[5.1, 3.5, 1.4, 0.2]] # Example new data point
prediction = loaded_model.predict(new_data)
print(prediction)
proba = loaded_model.predict_proba(new_data)
print(proba)