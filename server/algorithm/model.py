import sys
import io
import base64
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from PIL import Image 
sys.dont_write_bytecode = True

budget_limit = int(sys.argv[1])
cumulative_spending = [int(numeric_string) for numeric_string in sys.argv[2].split(",")]

data = {
    "Day": np.arange(1, len(cumulative_spending) + 1),  
    "Cumulative_Spending": cumulative_spending
}

df = pd.DataFrame(data)

X = df["Day"].values.reshape(-1, 1)
y = df["Cumulative_Spending"].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

future_days = np.arange(1, 31).reshape(-1, 1) 
predicted_spending = model.predict(future_days)

days_to_exhaustion = np.argmax(predicted_spending > budget_limit) + 1
exhaustion_date = f"Day {days_to_exhaustion}" if days_to_exhaustion > 0 else "Budget not exhausted"

plt.figure(figsize=(10, 6))
plt.scatter(df["Day"], df["Cumulative_Spending"], color="blue", label="Actual Spending")
plt.plot(future_days, predicted_spending, color="red", linestyle="--", label="Predicted Spending")
plt.axhline(y=budget_limit, color="green", linestyle="--", label="Budget Limit")
plt.title("Budget Exhaustion Prediction")
plt.xlabel("Day")
plt.ylabel("Cumulative Spending")
plt.legend()
plt.grid()
plt.tight_layout()

fig = plt.gcf() 

buf = io.BytesIO()
plt.savefig(buf, format="jpeg")
buf.seek(0)
base64_image = base64.b64encode(buf.getvalue()).decode('utf-8')

thisdict = {
  "daysLeft": int(days_to_exhaustion),
  "figure": "data:image/jpeg;base64," + base64_image,
}

print(json.dumps(thisdict))  
sys.stdout.flush()
