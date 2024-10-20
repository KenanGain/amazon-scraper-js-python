// const puppeteer = require('puppeteer');

// // Function to scrape Amazon search results
// async function scrapeAmazonSearch(productName) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     const searchQuery = productName.replace(" ", "+");
//     const url = `https://www.amazon.in/s?k=${searchQuery}`;

//     // Navigate to the search results page
//     await page.goto(url, { waitUntil: 'domcontentloaded' });

//     const products = await page.evaluate(() => {
//         const productElements = Array.from(document.querySelectorAll('.a-link-normal.s-underline-text'));

//         return productElements.slice(0, 10).map(product => {
//             const titleElement = product.querySelector('span.a-text-normal');
//             const priceElement = product.closest('.sg-col-inner').querySelector('.a-price-whole');
//             const ratingElement = product.closest('.sg-col-inner').querySelector('.a-icon-alt');

//             return {
//                 title: titleElement ? titleElement.innerText.trim() : "N/A",
//                 price: priceElement ? priceElement.innerText.trim() : "N/A",
//                 rating: ratingElement ? ratingElement.innerText.trim() : "N/A",
//                 link: product.href.startsWith('http') ? product.href : `https://www.amazon.in${product.getAttribute('href')}`
//             };
//         });
//     });

//     await browser.close();
//     return products;
// }

// // Example usage
// (async () => {
//     const productName = process.argv[2] || 'playstation 5';
//     console.log(`Searching for: ${productName}`);

//     try {
//         const results = await scrapeAmazonSearch(productName);
//         console.log(JSON.stringify(results, null, 4));
//     } catch (error) {
//         console.error("Error scraping Amazon:", error);
//     }
// })();

const puppeteer = require('puppeteer');

// Function to scrape Amazon search results
async function scrapeAmazonSearch(productName) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const searchQuery = productName.replace(" ", "+");
    const url = `https://www.amazon.ca/s?k=${searchQuery}`;

    // Navigate to the search results page
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const products = await page.evaluate(() => {
        const productElements = Array.from(document.querySelectorAll('div.s-main-slot div.s-result-item'));

        return productElements.map(product => {
            const titleElement = product.querySelector('span.a-text-normal');
            const priceElement = product.querySelector('.a-price-whole');
            const ratingElement = product.querySelector('.a-icon-alt');
            const linkElement = product.querySelector('a.a-link-normal.s-no-outline');

            return {
                title: titleElement ? titleElement.innerText.trim() : "N/A",
                price: priceElement ? priceElement.innerText.trim() : "N/A",
                rating: ratingElement ? ratingElement.innerText.trim() : "N/A",
                link: linkElement ? `https://www.amazon.ca${linkElement.getAttribute('href')}` : "N/A"
            };
        }).filter(product => product.title !== "N/A"); // Filter out products with no title
    });

    await browser.close();
    return products;
}

// Example usage
(async () => {
    const productName = process.argv[2] || 'playstation 5';
    console.log(`Searching for: ${productName}`);

    try {
        const results = await scrapeAmazonSearch(productName);
        console.log(JSON.stringify(results, null, 4));
    } catch (error) {
        console.error("Error scraping Amazon:", error);
    }
})();
