"""Read-only verification of the public sources linked from this site's HTML."""
import concurrent.futures
import json
import pathlib
import re
import urllib.request

root = pathlib.Path(__file__).resolve().parent
html = (root.parent / 'site' / 'index.html').read_text(encoding='utf-8')
urls = sorted(set(re.findall(r'href="(https://[^\"]+)"', html)))

def verify(url):
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (source verification)'})
        with urllib.request.urlopen(request, timeout=25) as response:
            body = response.read(200000).decode('utf-8', errors='replace')
            title = re.search(r'<title[^>]*>(.*?)</title>', body, re.S | re.I)
            return {'url': url, 'status': response.status, 'finalUrl': response.url,
                    'title': re.sub(r'\s+', ' ', title.group(1)).strip() if title else ''}
    except Exception as error:
        return {'url': url, 'error': str(error)}

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(verify, urls))
(root / 'results').mkdir(exist_ok=True)
(root / 'results' / 'public-links.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(results, ensure_ascii=False, indent=2))
raise SystemExit(0 if all(item.get('status') == 200 for item in results) else 1)
