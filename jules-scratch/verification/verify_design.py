from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Wait for the heading to be visible
        heading = page.get_by_role("heading", name="Limecord")
        expect(heading).to_be_visible()

        # Wait for 5 seconds for styles to apply
        page.wait_for_timeout(5000)

        page.screenshot(path="jules-scratch/verification/login_page.png")
        browser.close()

run()
