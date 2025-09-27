from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
import pickle

# Example: Train a model
iris = load_iris()
X, y = iris.data, iris.target

model = RandomForestClassifier()
model.fit(X, y)

# Save the trained model to a pickle file
with open('rf_model.pkl', 'wb') as f:
    pickle.dump(model, f)
