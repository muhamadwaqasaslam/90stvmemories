import os
import json
import datetime
import sys
from blogger_bot import load_config, load_articles, save_articles, send_blogger_post

BOT_DIR = os.path.dirname(os.path.abspath(__file__))

def get_next_article(articles):
    for a in articles:
        if not a.get("posted_blogger", False):
            return a
    # If all posted, loop back or return None
    return None

def run_daily_post(sender_password=None):
    config = load_config()
    articles = load_articles()
    
    next_article = get_next_article(articles)
    if not next_article:
        print("[BOT] All 44 articles have been posted! Resetting queue...")
        for a in articles:
            a["posted_blogger"] = False
        save_articles(articles)
        next_article = articles[0]
        
    print(f"\n==================================================")
    print(f"🤖 90s TV MEMORIES AUTO-POSTING BOT")
    print(f"==================================================")
    print(f"📅 Date: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🎯 Target Article: [{next_article['id']}/44] {next_article['title']}")
    print(f"🔗 URL: {next_article['url']}")
    print(f"📧 Destination Blogger: {config['blogger_email']}")
    print(f"--------------------------------------------------")
    
    password = sender_password or os.environ.get("SENDER_PASSWORD") or os.environ.get("GMAIL_APP_PASSWORD")
    
    if not password:
        print("\n⚠️ Note: GMAIL_APP_PASSWORD is not set yet.")
        print("To enable instant 100% automated posting to Blogger:")
        print("Set your 16-character Google App Password in environment or enter it below.\n")
        
        # Interactive prompt if running locally
        if sys.stdin.isatty():
            try:
                user_pass = input("Enter your Gmail App Password (or press ENTER to simulate): ").strip()
                if user_pass:
                    password = user_pass
            except Exception:
                pass
                
    if password:
        try:
            print(f"[BOT] Connecting to SMTP server and sending post...")
            send_blogger_post(
                article=next_article,
                sender_email=config["sender_email"],
                sender_password=password,
                blogger_email=config["blogger_email"],
                smtp_server=config.get("smtp_server", "smtp.gmail.com"),
                smtp_port=config.get("smtp_port", 587)
            )
            print(f"✅ SUCCESS! Post published live to Blogger blog: https://{config.get('blog_subdomain', '90stvmemories12')}.blogspot.com")
            next_article["posted_blogger"] = True
            next_article["last_posted_date"] = datetime.datetime.now().isoformat()
            save_articles(articles)
            print(f"[BOT] Database updated. Next article queued.")
            return True
        except Exception as e:
            print(f"❌ Failed to send email to Blogger: {e}")
            return False
    else:
        print(f"[BOT - SIMULATION MODE] Ready to post: '{next_article['title']}'")
        print(f"HTML Content and backlink generated successfully!")
        return False

if __name__ == "__main__":
    pwd = sys.argv[1] if len(sys.argv) > 1 else None
    run_daily_post(pwd)
