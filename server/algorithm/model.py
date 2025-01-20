import sys
import io
import os
import shutil
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from PIL import Image 
sys.dont_write_bytecode = True

data = {
    "Day": np.arange(1, 6),  
    "Cumulative_Spending": [900, 1200, 1500, 1900, 2300]
}

df = pd.DataFrame(data)

budget_limit = 3000

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

def fig2img(fig): 
    buf = io.BytesIO() 
    fig.savefig(buf) 
    buf.seek(0) 
    img = Image.open(buf) 
    return img 

buf = io.BytesIO() 
img = fig2img(fig) 
img = img.convert('RGB')
img.save(buf, format="JPEG")
buffer = buf.getvalue()

thisdict = {
  "daysLeft": "days_to_exhaustion",
  "figure": buffer,
}

print(json.dumps(thisdict))  # Print as JSON string
sys.stdout.flush()
