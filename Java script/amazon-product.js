const puppeteer = require('puppeteer');

// Function to scrape the main product page and reviews
async function scrapeAmazonProduct(productURL) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Go to the product page
        await page.goto(productURL, { waitUntil: 'domcontentloaded' });

        // Scrape the product details
        const productData = await page.evaluate(() => {
            const title = document.querySelector('#productTitle')?.innerText.trim() || 'N/A';
            const description = document.querySelector('#feature-bullets ul')?.innerText.trim() || 'N/A';
            const price = document.querySelector('.a-price .a-offscreen')?.innerText.trim() || 'N/A';
            const stars = document.querySelector('.a-icon-alt')?.innerText.trim() || 'N/A';
            const reviewsCount = document.querySelector('#acrCustomerReviewText')?.innerText.trim() || 'N/A';
            const productImage = document.querySelector('#landingImage')?.src || 'N/A';

            return { title, description, price, stars, reviewsCount, productImage };
        });

        // Scrape customer reviews
        const reviews = await scrapeCustomerReviews(page);
        productData.reviews = reviews;

        // Scrape recommendations
        const recommendations = await scrapeRecommendations(page);
        productData.recommendations = recommendations;

        await browser.close();
        return productData;
    } catch (error) {
        console.error("Error scraping Amazon product:", error);
        await browser.close();
        return {};
    }
}

// Function to scrape customer reviews from the product page
async function scrapeCustomerReviews(page) {
    try {
        const seeAllReviewsSelector = 'a[data-hook="see-all-reviews-link-foot"]';
        if (await page.$(seeAllReviewsSelector)) {
            await page.click(seeAllReviewsSelector);
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        }

        const reviews = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.review-text-content span')).map(review =>
                review.innerText.trim()
            )
        );

        return reviews;
    } catch (error) {
        console.error("Error scraping reviews:", error);
        return [];
    }
}

// Function to scroll down the page to load lazy elements
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= document.body.scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

// Function to scrape recommendations from the product page
async function scrapeRecommendations(page) {
    try {
        // Scroll to ensure the carousel loads
        await autoScroll(page);

        // Wait for the recommendations carousel to appear
        await page.waitForSelector('.a-carousel-card', { timeout: 5000 });

        const recommendations = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.a-carousel-card')).map(card => {
                const productName = card.querySelector('.p13n-sc-truncate, span')?.innerText.trim() || 'N/A';
                const productPrice = card.querySelector('.a-price-whole')?.innerText.trim() || 'N/A';
                const productImage = card.querySelector('img')?.src || 'N/A';
                const productLink = card.querySelector('a')?.href || 'N/A';
                return { productName, productPrice, productImage, productLink };
            })
        );

        return recommendations;
    } catch (error) {
        console.error("Error scraping recommendations:", error);
        return [];
    }
}

// Example usage
(async () => {
    const productURL = process.argv[2] || 'https://www.amazon.ca/dp/B0C4G7FHR8';
    console.log(`Scraping product from: ${productURL}`);

    try {
        const product = await scrapeAmazonProduct(productURL);
        console.log(JSON.stringify(product, null, 4));
    } catch (error) {
        console.error("Error:", error);
    }
})();


// const puppeteer = require('puppeteer');

// // Function to scrape the main product page and reviews
// async function scrapeAmazonProduct(productURL) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     try {
//         // Go to the product page
//         await page.goto(productURL, { waitUntil: 'domcontentloaded' });

//         // Scrape the product details
//         const productData = await page.evaluate(() => {
//             const title = document.querySelector('#productTitle')?.innerText.trim() || 'N/A';
//             const description = document.querySelector('#feature-bullets ul')?.innerText.trim() || 'N/A';
//             const price = document.querySelector('.a-price .a-offscreen')?.innerText.trim() || 'N/A';
//             const stars = document.querySelector('.a-icon-alt')?.innerText.trim() || 'N/A';
//             const reviewsCount = document.querySelector('#acrCustomerReviewText')?.innerText.trim() || 'N/A';
//             const productImage = document.querySelector('#landingImage')?.src || 'N/A';

//             return { title, description, price, stars, reviewsCount, productImage };
//         });

//         // Scrape the customer reviews from the product page
//         const reviews = await scrapeCustomerReviews(page);
//         productData.reviews = reviews;

//         await browser.close();
//         return productData;
//     } catch (error) {
//         console.error("Error scraping Amazon product:", error);
//         await browser.close();
//         return {};
//     }
// }

// // Function to scrape customer reviews from the product page
// async function scrapeCustomerReviews(page) {
//     try {
//         // Check if the "See all reviews" link is present and click it
//         const seeAllReviewsSelector = 'a[data-hook="see-all-reviews-link-foot"]';
//         if (await page.$(seeAllReviewsSelector)) {
//             await page.click(seeAllReviewsSelector);
//             await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
//         }

//         // Extract customer reviews
//         const reviews = await page.evaluate(() =>
//             Array.from(document.querySelectorAll('.review-text-content span')).map(review =>
//                 review.innerText.trim()
//             )
//         );

//         return reviews;
//     } catch (error) {
//         console.error("Error scraping reviews:", error);
//         return [];
//     }
// }

// // Example usage
// (async () => {
//     const productURL = process.argv[2] || 'https://www.amazon.ca/dp/B0C4G7FHR8';
//     console.log(`Scraping product from: ${productURL}`);

//     try {
//         const product = await scrapeAmazonProduct(productURL);
//         console.log(JSON.stringify(product, null, 4));
//     } catch (error) {
//         console.error("Error:", error);
//     }
// })();

// const puppeteer = require('puppeteer');

// // Function to scrape an Amazon product page
// async function scrapeAmazonProduct(productURL) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     // Go to the product page
//     await page.goto(productURL, { waitUntil: 'domcontentloaded' });

//     const productData = await page.evaluate(() => {
//         const title = document.querySelector('#productTitle')?.innerText.trim() || 'N/A';
//         const description = document.querySelector('#feature-bullets ul')?.innerText.trim() || 'N/A';
//         const price = document.querySelector('.a-price .a-offscreen')?.innerText.trim() || 'N/A';
//         const stars = document.querySelector('.a-icon-alt')?.innerText.trim() || 'N/A';
//         const reviews = document.querySelector('#acrCustomerReviewText')?.innerText.trim() || 'N/A';
//         const recommendations = Array.from(document.querySelectorAll('.a-carousel-card .p13n-sc-truncate'))
//             .map(el => el.innerText.trim()) || [];
//         const productImage = document.querySelector('#landingImage')?.src || 'N/A';

//         return {
//             title,
//             description,
//             price,
//             stars,
//             reviews,
//             recommendations,
//             productImage
//         };
//     });

//     await browser.close();
//     return productData;
// }

// // Example usage
// (async () => {
//     const productURL = process.argv[2] || 'https://www.amazon.in/dp/B0CY5QW186';
//     console.log(`Scraping product from: ${productURL}`);

//     try {
//         const product = await scrapeAmazonProduct(productURL);
//         console.log(JSON.stringify(product, null, 4));
//     } catch (error) {
//         console.error("Error scraping Amazon product:", error);
//     }
// })();
// const puppeteer = require('puppeteer');

// Function to scrape a single Amazon product page
// async function scrapeAmazonProduct(productURL) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     // Go to the product page
//     await page.goto(productURL, { waitUntil: 'domcontentloaded' });

//     // Scrape the main product details
//     const productData = await page.evaluate(() => {
//         const title = document.querySelector('#productTitle')?.innerText.trim() || 'N/A';
//         const description = document.querySelector('#feature-bullets ul')?.innerText.trim() || 'N/A';
//         const price = document.querySelector('.a-price .a-offscreen')?.innerText.trim() || 'N/A';
//         const stars = document.querySelector('.a-icon-alt')?.innerText.trim() || 'N/A';
//         const reviews = document.querySelector('#acrCustomerReviewText')?.innerText.trim() || 'N/A';
//         const productImage = document.querySelector('#landingImage')?.src || 'N/A';

//         // Collect recommendations
//         const recommendations = Array.from(document.querySelectorAll('.a-carousel-card'))
//             .map(card => {
//                 const productLink = card.querySelector('a')?.href || 'N/A';
//                 const productName = card.querySelector('.p13n-sc-truncate')?.innerText.trim() || 'N/A';
//                 const productPrice = card.querySelector('.a-price-whole')?.innerText.trim() || 'N/A';
//                 return { productName, productLink, productPrice };
//             });

//         return {
//             title,
//             description,
//             price,
//             stars,
//             reviews,
//             productImage,
//             recommendations
//         };
//     });

//     // Scrape customer reviews from recommended products
//     const recommendationsWithReviews = [];
//     for (const recommendation of productData.recommendations) {
//         if (recommendation.productLink !== 'N/A') {
//             const reviews = await scrapeCustomerReviews(recommendation.productLink, browser);
//             recommendationsWithReviews.push({ ...recommendation, reviews });
//         }
//     }

//     await browser.close();

//     // Merge product data with enriched recommendations
//     return { ...productData, recommendations: recommendationsWithReviews };
// }

// // Function to scrape customer reviews from a product page
// async function scrapeCustomerReviews(productURL, browser) {
//     const page = await browser.newPage();
//     await page.goto(productURL, { waitUntil: 'domcontentloaded' });

//     const reviews = await page.evaluate(() => {
//         return Array.from(document.querySelectorAll('.review-text-content span'))
//             .map(review => review.innerText.trim());
//     });

//     await page.close();
//     return reviews;
// }

// // Example usage
// (async () => {
//     const productURL = process.argv[2] || 'https://www.amazon.in/dp/B0CY5QW186';
//     console.log(`Scraping product from: ${productURL}`);

//     try {
//         const product = await scrapeAmazonProduct(productURL);
//         console.log(JSON.stringify(product, null, 4));
//     } catch (error) {
//         console.error("Error scraping Amazon product:", error);
//     }
// })();
// const puppeteer = require('puppeteer');

// // Function to scrape customer reviews from a product page
// async function scrapeCustomerReviews(productURL) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     try {
//         // Go to the product page
//         await page.goto(productURL, { waitUntil: 'domcontentloaded' });

//         // Click on the 'See all reviews' link if available
//         const seeAllReviewsSelector = 'a[data-hook="see-all-reviews-link-foot"]';
//         if (await page.$(seeAllReviewsSelector)) {
//             await page.click(seeAllReviewsSelector);
//             await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
//         }

//         // Scrape the reviews on the page
//         const reviews = await page.evaluate(() =>
//             Array.from(document.querySelectorAll('.review-text-content span')).map(review =>
//                 review.innerText.trim()
//             )
//         );

//         await browser.close();
//         return reviews;
//     } catch (error) {
//         console.error("Error scraping reviews:", error);
//         await browser.close();
//         return [];
//     }
// }

// // Example usage
// (async () => {
//     const productURL =
//         process.argv[2] ||
//         'https://www.amazon.ca/Hitman-World-Assassination-Playstation-5/dp/B0C4G7FHR8';
//     console.log(`Scraping reviews from: ${productURL}`);

//     try {
//         const reviews = await scrapeCustomerReviews(productURL);
//         console.log(JSON.stringify(reviews, null, 4));
//     } catch (error) {
//         console.error("Error:", error);
//     }
// })();
