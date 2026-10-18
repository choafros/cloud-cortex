from pathlib import Path
from playwright.sync_api import sync_playwright
import base64
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="styles.css">','<style>'+(root/'styles.css').read_text()+'</style>').replace('<script src="script.js" defer></script>','')
for filename in ('brain.svg','favicon.svg'):
    html=html.replace('assets/'+filename,'data:image/svg+xml;base64,'+base64.b64encode((root/'assets'/filename).read_bytes()).decode())
html=html.replace('</body>','<script>'+(root/'script.js').read_text()+'</script></body>')
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True)
    try:
        for width in (1440,390):
            page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.set_content(html)
            assert page.locator('#architecture .node').count()==23
            assert page.locator('#overview-layer .semantic-node').count()==7
            assert page.locator('#deep-layer .semantic-node').count()==15
            page.locator('#zoom-out').click()
            assert page.locator('#architecture').get_attribute('data-view')=='overview'
            page.locator('[data-semantic-id="overview:events"]').click()
            header=page.locator('.inspector-fixed')
            page.wait_for_timeout(350)
            y=header.bounding_box()['y']
            details=page.locator('#inspector-scroll')
            assert details.evaluate('(e)=>e.scrollHeight>e.clientHeight')
            details.evaluate('(e)=>e.scrollTop=e.scrollHeight')
            assert abs(header.bounding_box()['y']-y)<1
            assert page.locator('#inspector-close').is_visible()
            assert page.locator('#inspector-state').is_visible()
            page.locator('#zoom-in').click()
            page.locator('#zoom-in').click()
            assert page.locator('#architecture').get_attribute('data-view')=='deep'
            page.locator('[data-semantic-id="deep:mutex"]').click()
            assert page.locator('#inspector-title').text_content()=='Idempotency'
            assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
            assert not errors,errors
            page.close()
        print('V1.6 detail-level and inspector checks passed')
    finally:
        browser.close()
