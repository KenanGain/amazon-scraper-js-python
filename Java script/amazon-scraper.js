// const puppeteer = require('puppeteer');

// async function scrapeAmazon(productURL) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
    
//     // Go to the product page and wait for content to load
//     await page.goto(productURL, { waitUntil: 'domcontentloaded' });

//     try {
//         await page.waitForSelector('#productTitle', { timeout: 5000 });

//         const product = await page.evaluate(() => {
//             const name = document.querySelector('#productTitle')?.innerText.trim();
//             const price = document.querySelector('.a-price .a-offscreen')?.innerText.trim();
//             const reviews = document.querySelector('#acrCustomerReviewText')?.innerText.trim();
//             const link = window.location.href;

//             return { name, price, reviews, link };
//         });

//         console.log(product);
//     } catch (error) {
//         console.error("Error fetching product data:", error);
//     }

//     await browser.close();
// }

// // Replace with the product URL you want to scrape
// scrapeAmazon('https://www.amazon.ca/Premium-Filtering-Bottle-Filter-BPA-Free/dp/B08SHTPD1L');
const puppeteer = require('puppeteer');

async function scrapeAmazon(productURL) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Go to the product page and wait for content to load
    await page.goto(productURL, { waitUntil: 'domcontentloaded' });

    try {
        await page.waitForSelector('#productTitle', { timeout: 5000 });

        const product = await page.evaluate(() => {
            const name = document.querySelector('#productTitle')?.innerText.trim();
            const price = document.querySelector('.a-price .a-offscreen')?.innerText.trim();
            const reviews = document.querySelector('#acrCustomerReviewText')?.innerText.trim();
            const starRating = document.querySelector('.a-icon-alt')?.innerText.trim();

            // Collect individual customer reviews
            const reviewElements = document.querySelectorAll('.review-text-content span');
            const customerReviews = Array.from(reviewElements).map(el => el.innerText.trim());

            const link = window.location.href;

            return {
                name,
                price,
                reviews,
                starRating,
                link,
                customerReviews
            };
        });

        console.log(product);
    } catch (error) {
        console.error("Error fetching product data:", error);
    }

    await browser.close();
}

// Replace with the product URL you want to scrape
scrapeAmazon('https://www.amazon.ca/Premium-Filtering-Bottle-Filter-BPA-Free/dp/B08SHTPD1L');
