import smtplib
import json
import os
import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

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
    
    html = f"""<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 720px; margin: auto;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="{img}" alt="{title}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  </div>

  <p style="font-size: 18px; color: #1f2937; font-weight: 500; margin-bottom: 18px;">
    {excerpt}
  </p>

  <p style="font-size: 16px; color: #374151; margin-bottom: 22px;">
    For an entire generation that grew up in the 1990s, Friday nights were sacred and Saturday mornings were legendary. Between the peak of TGIF sitcom perfection, VHS tapes from the local rental store, and iconic teen dramas, 90s television defined American childhood. But behind the laughter and the laugh tracks, the true stories, sudden departures, and emotional reunion truths were rarely told on camera.
  </p>

  <div style="background: #f0f4fc; border-left: 5px solid #2b4886; padding: 20px 24px; margin: 30px 0; border-radius: 6px;">
    <h3 style="margin-top: 0; color: #2b4886; font-size: 18px;">
      👉 Read the Complete Feature Story & Behind-the-Scenes Secrets:
    </h3>
    <p style="margin: 8px 0 0 0; font-size: 16px;">
      Explore full cast updates, exclusive photographs, and untold drama on 
      <a href="{url}" target="_blank" rel="dofollow" style="color: #1d4ed8; font-weight: bold; text-decoration: underline;">
        {title} at 90s TV Memories
      </a>.
    </p>
  </div>

  <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 36px 0;" />
  <p style="font-size: 13px; color: #6b7280; text-align: center;">
    <em>Originally published on <a href="https://www.90stvmemories.com" target="_blank" rel="dofollow" style="color: #2b4886; font-weight: bold;">90s TV Memories</a> — your ultimate destination for Saturday morning cartoons, TGIF sitcoms, and retro nostalgia.</em>
  </p>
</div>"""
    return html

def send_blogger_post(article, sender_email, sender_password, blogger_email, smtp_server="smtp.gmail.com", smtp_port=587):
    title = article["title"]
    body_html = format_blogger_html(article)
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = title
    msg["From"] = sender_email
    msg["To"] = blogger_email
    
    msg.attach(MIMEText(body_html, "html", "utf-8"))
    
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(sender_email, sender_password)
    server.sendmail(sender_email, [blogger_email], msg.as_string())
    server.quit()
    return True

if __name__ == "__main__":
    print("Blogger Bot Module loaded successfully!")
