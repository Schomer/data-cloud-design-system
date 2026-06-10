from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    
    page_errors = []
    page.on("pageerror", lambda err: page_errors.append(err))
    page.on("console", lambda msg: page_errors.append(msg.text) if msg.type == "error" else None)
    
    # Go to app that has the missing backtick or a syntax error
    page.goto("http://127.0.0.1:5900/?app=App_1776749274", wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(2500)
    
    # The overlay exists in shadow root, so we pierce it if possible, or evaluate
    has_overlay = page.evaluate("() => !!document.querySelector('vite-error-overlay')")
    
    print(f"Has Vite Error Overlay: {has_overlay}")
    print(f"Page Errors: {page_errors}")
    
    browser.close()
