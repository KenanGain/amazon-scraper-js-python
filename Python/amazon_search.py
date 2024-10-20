from bs4 import BeautifulSoup
import requests
import json

# Define the function to scrape Amazon search results
def scrape_amazon_search(product_name):
    # Format the product name for the search URL
    search_query = product_name.replace(" ", "+")
    url = f"https://www.amazon.in/s?k={search_query}"

    # Headers to mimic a browser request
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.5",
    }

    # Request the search results page
    response = requests.get(url, headers=headers, timeout=10)

    # Check if the request was successful
    if response.status_code != 200:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")
        return []

    # Parse the search results page
    soup = BeautifulSoup(response.content, "html.parser")

    # Find all product links in the search results
    product_elements = soup.find_all(
        "a",
        class_="a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal",
    )

    base_url = "https://www.amazon.in"
    product_data = []

    # Loop through product elements and extract data
    for element in product_elements[:10]:  # Limit to first 10 products
        product_link = base_url + element.get("href")

        # Request each product page
        product_response = requests.get(product_link, headers=headers, timeout=10)
        product_soup = BeautifulSoup(product_response.content, "html.parser")

        try:
            title = product_soup.find("span", attrs={"id": "productTitle"}).text.strip()
        except AttributeError:
            title = "N/A"

        try:
            price = product_soup.find("span", class_="a-price-whole").text.strip()
        except AttributeError:
            price = "N/A"

        try:
            rating = product_soup.find("span", class_="a-icon-alt").text.strip()
        except AttributeError:
            rating = "N/A"

        product_data.append({
            "title": title,
            "price": price,
            "rating": rating,
            "link": product_link
        })

    return product_data

# Example usage: Scrape Amazon for "playstation 5"
if __name__ == "__main__":
    product_name = input("Enter the product name to search on Amazon: ")
    results = scrape_amazon_search(product_name)

    if results:
        # Print the results in JSON format
        print(json.dumps(results, indent=4))
    else:
        print("No products found.")
