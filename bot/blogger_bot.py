import smtplib
import json
import os
import datetime
import urllib.request
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

BOT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BOT_DIR, "config.json")
DB_PATH = os.path.join(BOT_DIR, "articles_db.json")

def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def load_articles():
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_articles(articles):
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

def format_blogger_html(article):
    title = article["title"]
    url = article["url"]
    img = article["image"]
    excerpt = article["excerpt"]
    
    # Generate Google SEO friendly tags based on article
    tags = ["#90sTV", "#90sNostalgia", "#TGIF", "#RetroTV", "#ChildhoodMemories", "#90sPopCulture"]
    if "cartoon" in url.lower() or "pokemon" in url.lower():
        tags.extend(["#90sCartoons", "#SaturdayMorning"])
    elif "actor" in url.lower() or "hottest" in url.lower():
        tags.extend(["#90sStars", "#HollywoodNostalgia"])
    elif "feud" in url.lower() or "drama" in url.lower():
        tags.extend(["#UntoldSecrets", "#CastReunion"])
    tag_str = " ".join(tags)

    html = f"""<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.7; color: #1f2937; max-width: 760px; margin: 0 auto; padding: 12px;">
  
  <p style="font-size: 19px; line-height: 1.6; color: #111827; font-weight: 500; margin-bottom: 22px;">
    <strong>📺 90s TV Flashback:</strong> {excerpt}
  </p>

  <h2 style="color: #1e3a8a; font-size: 22px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 28px;">
    The Untold Story Behind the Decade That Defined American Television
  </h2>

  <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
    For an entire generation who grew up in the 1990s, Friday nights were sacred and Saturday mornings were legendary. Between the golden era of TGIF sitcom perfection, VHS tapes from the local rental store, and iconic teen drama series, 90s television defined childhood for millions worldwide. But behind the beloved laughter, sudden cast departures, off-screen friction, and heartbreaking real-life stories were rarely shared with viewers at home.
  </p>

  <!-- High-CTR Featured Callout Box for Google SEO & Visitors -->
  <div style="background: linear-gradient(135deg, #f0f4fc 0%, #e8f0fe 100%); border-left: 6px solid #2563eb; padding: 22px 26px; margin: 34px 0; border-radius: 8px; box-shadow: 0 4px 14px rgba(37,99,235,0.08);">
    <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 19px; font-weight: 700;">
      👉 Read the Complete Untold Story & Behind-the-Scenes Secrets:
    </h3>
    <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #1f2937;">
      Discover full cast revelations, exclusive photos, and deep retrospectives on:
    </p>
    <p style="margin: 12px 0 0 0;">
      <a href="{url}" target="_blank" rel="dofollow" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: bold; text-decoration: none; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
        Read Full Feature Article on 90s TV Memories &raquo;
      </a>
    </p>
    <p style="margin: 12px 0 0 0; font-size: 13px; color: #4b5563;">
      Direct Link: <a href="{url}" target="_blank" rel="dofollow" style="color: #2563eb; font-weight: 600;">{url}</a>
    </p>
  </div>

  <h3 style="color: #1f2937; font-size: 18px; margin-top: 26px;">
    Topic Keywords & Community Tags:
  </h3>
  <p style="font-size: 14px; color: #2563eb; font-weight: 500; word-spacing: 4px; margin-bottom: 28px;">
    {tag_str}
  </p>

  <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0 20px 0;" />
  <p style="font-size: 13px; color: #6b7280; text-align: center;">
    <em>Originally syndicated from <a href="https://www.90stvmemories.com" target="_blank" rel="dofollow" style="color: #2563eb; font-weight: 600;">90s TV Memories</a> &mdash; your premiere destination for TGIF sitcom nostalgia, Saturday morning cartoons, and retro retrospectives.</em>
  </p>
</div>

#end"""
    return html

def send_blogger_post(article, sender_email, sender_password, blogger_email, smtp_server="smtp.gmail.com", smtp_port=587):
    title = article["title"]
    body_html = format_blogger_html(article)
    img_url = article.get("image", "")
    
    msg = MIMEMultipart("related")
    msg["Subject"] = title
    msg["From"] = sender_email
    msg["To"] = blogger_email
    
    # 1. Attach HTML body
    msg.attach(MIMEText(body_html, "html", "utf-8"))
    
    # 2. Download and attach Image (Blogger displays attached images automatically at top of post!)
    if img_url:
        try:
            print(f"[BOT] Fetching article HD image: {img_url}")
            req = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                img_data = resp.read()
                
            img_part = MIMEImage(img_data)
            img_part.add_header("Content-Disposition", "attachment", filename=f"cover_{article['id']}.jpg")
            msg.attach(img_part)
            print("[BOT] HD Image attached to email successfully!")
        except Exception as e:
            print(f"[BOT WARNING] Could not download image ({e}), sending rich text only.")

    print(f"[BOT] Connecting to SMTP ({smtp_server}:{smtp_port})...")
    server = smtplib.SMTP(smtp_server, smtp_port, timeout=20)
    server.starttls()
    server.login(sender_email, sender_password)
    server.sendmail(sender_email, [blogger_email], msg.as_string())
    server.quit()
    return True

if __name__ == "__main__":
    print("Blogger Bot Module ready with HD Image Attachment & SEO Styling!")
