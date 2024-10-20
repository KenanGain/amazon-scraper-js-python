import requests
from bs4 import BeautifulSoup
import json

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Accept-Language": "en-US, en;q=0.5"
}

# Function to scrape the main product details
def scrape_amazon_product(url):
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        print(f"Failed to fetch the product page. Status code: {response.status_code}")
        return {}

    soup = BeautifulSoup(response.content, 'html.parser')

    # Extract product details
    title = soup.select_one('#productTitle')
    description = soup.select_one('#feature-bullets ul')
    price = soup.select_one('.a-price .a-offscreen')
    stars = soup.select_one('.a-icon-alt')
    reviews_count = soup.select_one('#acrCustomerReviewText')
    product_image = soup.select_one('#landingImage')

    product_data = {
        "title": title.get_text(strip=True) if title else "N/A",
        "description": description.get_text(strip=True) if description else "N/A",
        "price": price.get_text(strip=True) if price else "N/A",
        "stars": stars.get_text(strip=True) if stars else "N/A",
        "reviewsCount": reviews_count.get_text(strip=True) if reviews_count else "N/A",
        "productImage": product_image['src'] if product_image else "N/A"
    }

    # Scrape customer reviews
    product_data["reviews"] = scrape_customer_reviews(soup)

    # Scrape recommendations
    product_data["recommendations"] = scrape_recommendations(soup)

    return product_data

# Function to scrape customer reviews
def scrape_customer_reviews(soup):
    reviews = []
    review_elements = soup.select('.review-text-content span')

    for review in review_elements:
        reviews.append(review.get_text(strip=True))

    return reviews

# Function to scrape recommendations
def scrape_recommendations(soup):
    recommendations = []
    recommendation_elements = soup.select('.a-carousel-card')

    for card in recommendation_elements:
        product_name = card.select_one('.p13n-sc-truncate, span')
        product_price = card.select_one('.a-price-whole')
        product_image = card.select_one('img')
        product_link = card.select_one('a')

        recommendations.append({
            "productName": product_name.get_text(strip=True) if product_name else "N/A",
            "productPrice": product_price.get_text(strip=True) if product_price else "N/A",
            "productImage": product_image['src'] if product_image else "N/A",
            "productLink": f"https://www.amazon.ca{product_link['href']}" if product_link else "N/A"
        })

    return recommendations

# Example usage
if __name__ == "__main__":
    product_url = input("Enter the Amazon product URL: ") or "https://www.amazon.ca/dp/B0C4G7FHR8"
    print(f"Scraping product from: {product_url}")

    try:
        product = scrape_amazon_product(product_url)
        print(json.dumps(product, indent=4))
    except Exception as e:
        print(f"Error scraping Amazon product: {e}")
