from playwright.sync_api import sync_playwright, expect
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Construct the full, absolute path to the HTML file
        # This is more reliable than a relative path
        file_path = os.path.abspath('index.html')

        # Go to the local HTML file
        page.goto(f'file://{file_path}')

        # Wait for the first intervention button to be available and click it
        # This should trigger a news update
        first_intervention_button = page.locator('.intervention-btn').first
        expect(first_intervention_button).to_be_enabled()
        first_intervention_button.click()

        # Wait for the news container to have a news item in it
        news_container = page.locator('#news-container')
        # Check that the first news item has the expected text
        first_news_item = news_container.locator('.news-item').first
        expect(first_news_item).to_have_text("Global productivity soars as workers discover they can now cry in the comfort of their own homes. Synergy!")

        # Take a screenshot to visually verify the result
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()