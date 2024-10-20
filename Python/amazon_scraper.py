from bs4 import BeautifulSoup
import requests
import pandas as pd

# URL for PlayStation 5 search on Amazon India
URL = "https://www.amazon.in/s?k=playstation+5&sprefix=pla%2Caps%2C464&ref=nb_sb_ss_ts-doa-p_1_3"

# Headers to simulate a real browser visit (replace 'your user agent' with your actual user-agent)
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.5",
}

# Step 1: Make a request to the search results page
response = requests.get(URL, headers=HEADERS, timeout=10)

# Check if the request was successful
if response.status_code != 200:
    print(f"Failed to retrieve webpage. Status code: {response.status_code}")
    exit()

# Step 2: Parse the search results page with BeautifulSoup
soup = BeautifulSoup(response.content, "html.parser")

# Step 3: Find all product links
product_links = soup.find_all(
    "a",
    class_="a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal",
)

# Extract full product URLs
base_url = "https://www.amazon.in"
all_product_links = [base_url + link.get("href") for link in product_links]

print(f"Found {len(all_product_links)} product links.")

# Step 4: Loop through the product links and extract details
product_data = []

for product_link in all_product_links:
    try:
        # Request each product page
        product_response = requests.get(product_link, headers=HEADERS, timeout=10)
        product_soup = BeautifulSoup(product_response.content, "html.parser")

        # Extract product title
        try:
            title = product_soup.find("span", attrs={"id": "productTitle"}).text.strip()
        except AttributeError:
            title = "N/A"

        # Extract product price
        try:
            price = product_soup.find(
                "span", attrs={"class": "a-price-whole"}
            ).text.strip()
        except AttributeError:
            price = "N/A"

        # Extract star rating
        try:
            rating = product_soup.find("span", attrs={"class": "a-icon-alt"}).text.strip()
        except AttributeError:
            rating = "N/A"

        # Save product data
        product_data.append({
            "title": title,
            "price": price,
            "rating": rating,
            "link": product_link
        })

        print(f"Scraped: {title}")

    except Exception as e:
        print(f"Error scraping {product_link}: {e}")

# Step 5: Save the product data to a CSV file
df = pd.DataFrame(product_data)
df.to_csv("amazon_playstation5_products.csv", index=False)

print("Product data saved to amazon_playstation5_products.csv")
