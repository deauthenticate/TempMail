import os, pytz, json
from datetime import datetime
from aiosmtpd.controller import Controller
from email.parser import BytesParser
from email.policy import default


STORAGE_DIR = "emails"


class MailServer:
    def __init__(self):
        os.makedirs(STORAGE_DIR, exist_ok=True)

    async def handle_DATA(self, server, session, envelope):
        print("📝 DEBUG: Received email request.")
        
        parser = BytesParser(policy=default)
        message = parser.parsebytes(envelope.content)

        mail_to = envelope.rcpt_tos[0]
        mail_from = envelope.mail_from
        subject = message.get("subject", "")
        content = message.get_body(preferencelist=('plain', 'html')).get_content()

        ist = pytz.timezone("Asia/Kolkata")
        ist_timestamp = datetime.now(ist).strftime("%Y-%m-%d %H:%M:%S")
        mail_data = {
            "from": mail_from,
            "to": mail_to,
            "subject": subject,
            "content": content,
            "timestamp": ist_timestamp
        }

        inbox_name = mail_to.replace("@", "_at_")
        inbox_path = os.path.join(STORAGE_DIR, f"{inbox_name}.json")

        print(f"📝 DEBUG: Parsed email data for {mail_to}:")
        print(f"From: {mail_from}")
        print(f"Subject: {subject}")
        print(f"Content: {content}")

        if os.path.exists(inbox_path):
            with open(inbox_path, 'r') as f:
                emails = json.load(f)
        else:
            emails = []

        emails.append(mail_data)

        with open(inbox_path, 'w') as f:
            json.dump(emails, f, indent=2)

        print(f"📥 Received email for {mail_to}: {subject}")
        return '250 Message accepted for delivery'


if __name__ == "__main__":
    handler = MailServer()
    controller = Controller(handler, hostname="176.100.36.96", port=25)

    controller.start()
    print("📡 SMTP server running on port 25 (catch-all enabled)")

    try:
        print("🔁 Waiting for emails... Press Ctrl+C to stop.")
        while True:
            pass  
    except KeyboardInterrupt:
        print("\n🛑 Shutting down server...")
        controller.stop()
