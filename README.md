# **Amazon Scraper Project (Python & JavaScript)**

This project provides **Amazon product and search scraping functionality** using both **Python** and **JavaScript**. The scrapers allow you to extract essential product information such as the title, price, reviews, recommendations, and more.  

GitHub Repository: [KenanGain/amazon-scraper-js-python](https://github.com/KenanGain/amazon-scraper-js-python)

---

## **Project Structure**

```
📦 amazon-scraper-js-python
├── 📂 JavaScript
│   ├── amazon-product.js   # Amazon product scraper (JS)
│   ├── amazon-search.js    # Amazon search scraper (JS)
├── 📂 Python
│   ├── amazon_product.py   # Amazon product scraper (Python)
│   ├── amazon_search.py    # Amazon search scraper (Python)
└── README.md               # Documentation (this file)
```

---

## **Features**

### **Amazon Search Scraper**
- Extracts search results from Amazon including:
  - Product name
  - Product link
  - Price
  - Rating

### **Amazon Product Scraper**
- Extracts detailed product information:
  - Title
  - Description
  - Price
  - Star rating
  - Review count
  - Product image
  - **First 5 customer reviews**
  - **First 5 recommended products**

---

## **Prerequisites**

Ensure you have the following installed:

### **Python Requirements**
- Python 3.x
- Libraries: `requests`, `beautifulsoup4`

**Install Dependencies:**
```bash
pip install requests beautifulsoup4
```

### **JavaScript Requirements**
- Node.js
- Puppeteer Library

**Install Puppeteer:**
```bash
npm install puppeteer
```

---

## **How to Run the Scripts**

### **Python Scripts**

#### 1. **Amazon Product Scraper (Python)**

Extracts product details and recommendations.

**Navigate to the Python folder:**
```bash
cd Python
```

**Run the script:**
```bash
python amazon_product.py
```

**Input:**
Provide an Amazon product URL when prompted.

#### 2. **Amazon Search Scraper (Python)**

Extracts search results from Amazon.

**Run the script:**
```bash
python amazon_search.py
```

**Input:**
Enter a search keyword when prompted.

---

### **JavaScript Scripts**

#### 1. **Amazon Product Scraper (JavaScript)**

Extracts product details and recommendations using Puppeteer.

**Navigate to the JavaScript folder:**
```bash
cd JavaScript
```

**Run the script:**
```bash
node amazon-product.js "https://www.amazon.ca/dp/B0C4G7FHR8"
```

#### 2. **Amazon Search Scraper (JavaScript)**

Extracts search results using Puppeteer.

**Run the script:**
```bash
node amazon-search.js "playstation 5"
```

---

## **Example Output**

### **Amazon Product Scraper (Python / JavaScript)**

```json
{
    "title": "Hitman World Of Assassination Playstation 5",
    "description": "Enter the world of the Ultimate Assassin...",
    "price": "$49.98",
    "stars": "4.6 out of 5 stars",
    "reviewsCount": "138 ratings",
    "productImage": "https://m.media-amazon.com/images/I/71ppVrRA56L.jpg",
    "reviews": [
        "Amazing, addicting game.",
        "Perfect brand new game.",
        "Great video game from start to finish.",
        "Super fast delivery. New product as promised.",
        "Its all 3 hitman games. Also comes with VR mode."
    ],
    "recommendations": [
        {
            "productName": "DualSense Wireless Controller",
            "productPrice": "89.99",
            "productImage": "https://m.media-amazon.com/images/I/71r69Y7BSeL.jpg",
            "productLink": "https://www.amazon.ca/dp/B08FC5L3RG"
        }
    ]
}
```

---

## **Error Handling**

- **Blocked Requests**: Use rotating proxies or user agents if Amazon blocks the requests.
- **Missing Elements**: If certain elements are not found, inspect the page using **DevTools (F12)** to confirm the structure.

---

## **Contributing**

Feel free to contribute to the project by submitting pull requests or issues.

---

## **License**

This project is licensed under the MIT License.

---

Let me know if this works for you!
