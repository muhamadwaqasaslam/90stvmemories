import os
import json
import csv

BOT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BOT_DIR, "articles_db.json")

def generate_pinterest_bulk_csv(output_csv_path):
    with open(DB_PATH, "r", encoding="utf-8") as f:
        articles = json.load(f)
        
    fieldnames = ["Title", "Media URL", "Pinterest board", "Thumbnail", "Description", "Link", "Publish date", "Keywords"]
    
    rows = []
    for a in articles:
        title = a["title"][:100]
        media_url = a["image"]
        board = "90s TV Memories"
        link = a["url"]
        desc = f"{a['excerpt']}\n\nDid you grow up watching this? Click the link to read the untold secrets and full cast update!\n\n#90sNostalgia #90sTV #ChildhoodMemories #RetroTV"[:500]
        keywords = "90s TV, 90s nostalgia, retro childhood, throwback"
        
        rows.append({
            "Title": title,
            "Media URL": media_url,
            "Pinterest board": board,
            "Thumbnail": "",
            "Description": desc,
            "Link": link,
            "Publish date": "",
            "Keywords": keywords
        })
        
    with open(output_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
        
    print(f"Generated Pinterest Bulk Schedule CSV with {len(rows)} pins at: {output_csv_path}")

if __name__ == "__main__":
    generate_pinterest_bulk_csv(os.path.join(BOT_DIR, "pinterest_pins.csv"))
