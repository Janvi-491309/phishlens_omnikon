"""
PhishLens — ML Classifier Training Script
Round 3, Module 1

Architecture:
    TF-IDF Vectorizer  (max 5000 features, 1-2 ngrams)
    +
    Multinomial Naive Bayes classifier

Usage:
    From the backend/ directory run:
        python models/train_classifier.py

Outputs:
    models/phishing_model.pkl      — trained MultinomialNB model
    models/tfidf_vectorizer.pkl    — fitted TfidfVectorizer

Both files are loaded at runtime by app/services/ml_classifier.py.
"""

import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

# ---------------------------------------------------------------------------
# Training Dataset
# Labels: "safe" | "phishing"
# Size:   120 labelled samples (60 safe, 60 phishing)
# ---------------------------------------------------------------------------

TRAINING_DATA = [
    # -----------------------------------------------------------------------
    # SAFE — Normal conversations
    # -----------------------------------------------------------------------
    ("Hey, are we still meeting for lunch at 12?", "safe"),
    ("Good morning! Hope you have a great day.", "safe"),
    ("Can you send me the project report by Friday?", "safe"),
    ("Dinner at 7pm tomorrow? Let me know.", "safe"),
    ("Thanks for the help earlier, really appreciate it!", "safe"),
    ("The meeting has been moved to 3pm in conference room B.", "safe"),
    ("Did you watch the game last night? It was incredible!", "safe"),
    ("Happy birthday! Hope you have a wonderful celebration.", "safe"),
    ("Just checking in — how are things going on your end?", "safe"),
    ("We should catch up soon. It has been a while!", "safe"),
    ("The weather is lovely today, perfect for a walk.", "safe"),
    ("Reminder: team standup at 10am tomorrow.", "safe"),
    ("I just finished reading that book you recommended. Loved it!", "safe"),
    ("Your package has been delivered to your front door.", "safe"),
    ("The quarterly results were above expectations.", "safe"),
    ("Let me know if you need any help with the presentation.", "safe"),
    ("Great working with you on this project!", "safe"),
    ("Your reservation at 7pm has been confirmed.", "safe"),
    ("I will be 10 minutes late to the call, sorry!", "safe"),
    ("Please review the attached document before the meeting.", "safe"),

    # -----------------------------------------------------------------------
    # SAFE — Normal service notifications
    # -----------------------------------------------------------------------
    ("Your order #12345 has been shipped and will arrive by Friday.", "safe"),
    ("Your monthly subscription has been renewed successfully.", "safe"),
    ("New comment on your post: 'Great work on the project!'", "safe"),
    ("Your flight has been confirmed. Check-in opens 24 hours before departure.", "safe"),
    ("Your appointment has been rescheduled to next Tuesday at 2pm.", "safe"),
    ("Your two-factor authentication code is 482910. Do not share this.", "safe"),
    ("Thank you for your payment. Your receipt is attached.", "safe"),
    ("Your application has been received. We will be in touch shortly.", "safe"),
    ("We have processed your refund. It will appear in 3-5 business days.", "safe"),
    ("Your weekly summary is ready. You completed 5 tasks this week.", "safe"),
    ("New message from John: Can we reschedule our meeting?", "safe"),
    ("Your password was changed successfully. If this was not you, contact support.", "safe"),
    ("System maintenance scheduled for Sunday 2am-4am UTC.", "safe"),
    ("Your download is complete. Click here to view your files.", "safe"),
    ("Welcome to the team! Your onboarding documents are ready.", "safe"),
    ("Your annual report is now available. Log in to view it.", "safe"),
    ("Thanks for signing up. Please confirm your email to complete registration.", "safe"),
    ("Your ticket has been assigned to support agent Maya.", "safe"),
    ("Backup completed successfully. All files are safe.", "safe"),
    ("Your new device has been added to your account.", "safe"),

    # -----------------------------------------------------------------------
    # SAFE — Normal banking and account notifications
    # -----------------------------------------------------------------------
    ("Your salary of Rs. 45,000 has been credited to your account.", "safe"),
    ("Transaction alert: Rs. 350 debited for grocery purchase.", "safe"),
    ("Your credit card bill of Rs. 12,400 is due on the 15th.", "safe"),
    ("Autopay for your electricity bill has been processed.", "safe"),
    ("Your fixed deposit has matured. Please visit the branch to renew.", "safe"),
    ("ATM withdrawal of Rs. 5,000 from Koramangala branch.", "safe"),
    ("Your UPI transaction of Rs. 200 to Swiggy was successful.", "safe"),
    ("Interest credited to your savings account: Rs. 312.", "safe"),
    ("Your loan EMI of Rs. 8,200 has been debited successfully.", "safe"),
    ("Balance enquiry: Your available balance is Rs. 23,410.", "safe"),

    # -----------------------------------------------------------------------
    # SAFE — OTP context (legitimate, non-suspicious)
    # -----------------------------------------------------------------------
    ("Your OTP for logging in to MyBank is 748291. Valid for 5 minutes.", "safe"),
    ("OTP 582031 is valid for 10 minutes for your purchase on Flipkart.", "safe"),
    ("Use OTP 920183 to confirm your UPI payment of Rs. 500.", "safe"),
    ("Your verification code for password reset is 374829. Do not share it.", "safe"),
    ("OTP 192847 for your new device registration on Gmail. Expires in 10 min.", "safe"),
    ("Your login code for Netflix is 489201. Expires in 5 minutes.", "safe"),
    ("Code 920374 for two-step verification on your account.", "safe"),
    ("Security code for your transaction: 748193. Valid for 3 minutes.", "safe"),
    ("Verification code: 291038. Enter this to activate your new SIM.", "safe"),
    ("Your Amazon order confirmation code is 837291.", "safe"),

    # -----------------------------------------------------------------------
    # PHISHING — Urgency and account suspension scams
    # -----------------------------------------------------------------------
    ("URGENT: Your bank account has been suspended. Verify your OTP immediately.", "phishing"),
    ("Action required: Your account will be permanently closed within 24 hours.", "phishing"),
    ("ALERT: Unusual login attempt detected. Confirm your identity now to avoid suspension.", "phishing"),
    ("Your Netflix account is about to be deactivated. Click here to reactivate it now.", "phishing"),
    ("IMPORTANT: Your PayPal account has been limited. Verify your information immediately.", "phishing"),
    ("Your Amazon account has been compromised. Reset your password NOW before it is too late.", "phishing"),
    ("Your Google account will be suspended in 24 hours. Verify immediately to avoid this.", "phishing"),
    ("URGENT ACTION REQUIRED: Your SBI account has been blocked due to suspicious activity.", "phishing"),
    ("Your credit card is suspended. Call our helpline immediately to prevent permanent closure.", "phishing"),
    ("LAST CHANCE: Confirm your details or your account will be permanently deleted.", "phishing"),
    ("Security alert: Your account has been accessed from a new location. Verify now.", "phishing"),
    ("Immediate action required: Your Apple ID has been locked. Click to unlock now.", "phishing"),
    ("Your HDFC bank account is at risk. Login immediately to secure your account.", "phishing"),
    ("WARNING: Unauthorized transaction detected. Confirm your identity to reverse it.", "phishing"),
    ("Your Microsoft account is expiring. Renew your subscription now to avoid losing access.", "phishing"),

    # -----------------------------------------------------------------------
    # PHISHING — OTP and credential theft
    # -----------------------------------------------------------------------
    ("Please share your OTP with our agent to verify your identity.", "phishing"),
    ("Your bank executive is calling. Please provide your PIN and OTP to complete verification.", "phishing"),
    ("Share your CVV and card number with our support team for a KYC update.", "phishing"),
    ("To receive your refund, please provide your net banking password to our agent.", "phishing"),
    ("Send us your Aadhaar number and OTP received to claim your government subsidy.", "phishing"),
    ("Enter your ATM PIN on this secure form to verify your account.", "phishing"),
    ("Our KYC team needs your account number and password to update your records.", "phishing"),
    ("To prevent account closure, share your social security number with our support.", "phishing"),
    ("Verify your credentials immediately: enter your username, password, and OTP here.", "phishing"),
    ("Bank executive on call. Please provide the OTP sent to your phone to process your request.", "phishing"),

    # -----------------------------------------------------------------------
    # PHISHING — Prize and reward scams
    # -----------------------------------------------------------------------
    ("Congratulations! You have been selected as today's lucky winner of Rs. 10 lakhs!", "phishing"),
    ("You have won an iPhone 15! Claim your prize by clicking the link below immediately.", "phishing"),
    ("WINNER ALERT: Your phone number has been selected in our annual lottery. Claim now!", "phishing"),
    ("You have been gifted a Rs. 5,000 Amazon gift card. Click to redeem before it expires.", "phishing"),
    ("Lucky you! You have won a free trip to Dubai. Provide your details to claim.", "phishing"),
    ("Congratulations! Your number won a cash bonus of Rs. 50,000. Verify your account to receive.", "phishing"),
    ("You have been selected for an exclusive reward. Claim your prize today, limited time!", "phishing"),
    ("You are our 1,000,000th visitor. You have won a special giveaway. Click to collect.", "phishing"),
    ("Your SIM number has won Rs. 25 lakhs in the government scheme. Respond to claim.", "phishing"),
    ("Lottery winner notification: You have won! Submit your personal details to receive your reward.", "phishing"),

    # -----------------------------------------------------------------------
    # PHISHING — Suspicious links and impersonation
    # -----------------------------------------------------------------------
    ("Click this link to verify your account: http://secure-banklogin.xyz/verify", "phishing"),
    ("Your account verification link: http://192.168.1.100/login?reset=1&token=abc123", "phishing"),
    ("Update your KYC at this link immediately: http://bit.ly/kycupdate-sbi", "phishing"),
    ("Your PayPal account is restricted. Verify at: http://paypal-secure-login.top/verify", "phishing"),
    ("Confirm your Netflix details here: http://netflix-payment-update.tk/billing", "phishing"),
    ("SBI Support: Login to restore your account: http://sbi-secure-portal.xyz/restore", "phishing"),
    ("Your package could not be delivered. Update your address: http://fedex-track.ml/update", "phishing"),
    ("Income Tax refund ready. Claim at: http://incometax-gov.tk/refund", "phishing"),
    ("Amazon team: Your order is on hold. Confirm details at http://amaz0n-orders.cf/confirm", "phishing"),
    ("Your Apple ID has been locked. Restore access: http://apple-id-recovery.gq/unlock", "phishing"),

    # -----------------------------------------------------------------------
    # PHISHING — Threat and legal action scams
    # -----------------------------------------------------------------------
    ("Legal notice: You must pay the outstanding fine of Rs. 15,000 or face arrest.", "phishing"),
    ("The cybercrime department has registered a case against you. Call immediately.", "phishing"),
    ("Your tax returns show discrepancies. Pay the penalty now to avoid prosecution.", "phishing"),
    ("Court summons: You are required to appear regarding fraud charges. Contact us immediately.", "phishing"),
    ("FINAL WARNING: Failure to respond will result in your account being handed to law enforcement.", "phishing"),
    ("Police cyber cell notice: Your IP has been flagged for illegal activity. Call to resolve.", "phishing"),
    ("IRDAI notice: Your insurance policy has lapsed. Pay the penalty or face consequences.", "phishing"),
    ("Last warning before account termination and legal action for unpaid dues.", "phishing"),
    ("You owe taxes. Immediate payment required or your assets will be seized.", "phishing"),
    ("RBI enforcement: Your account has been frozen due to suspicious transactions. Call us now.", "phishing"),

    # -----------------------------------------------------------------------
    # PHISHING — Job and investment scams
    # -----------------------------------------------------------------------
    ("Work from home and earn Rs. 50,000 per month. No experience needed. Apply now!", "phishing"),
    ("Exclusive investment opportunity: Double your money in 30 days. Limited spots!", "phishing"),
    ("You have been shortlisted for a high-paying job. Pay Rs. 2,000 registration fee to proceed.", "phishing"),
    ("Earn Rs. 10,000 daily by completing simple tasks. No investment required. Join now!", "phishing"),
    ("Our crypto trading bot guarantees 200% returns in a week. Invest now!", "phishing"),
]

# ---------------------------------------------------------------------------
# Split into texts and labels
# ---------------------------------------------------------------------------
texts, labels = zip(*TRAINING_DATA)
texts = list(texts)
labels = list(labels)

print(f"Dataset size     : {len(texts)} samples")
print(f"  Safe examples  : {labels.count('safe')}")
print(f"  Phishing examples: {labels.count('phishing')}")

# ---------------------------------------------------------------------------
# Train-test split (80/20)
# ---------------------------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.20, random_state=42, stratify=labels
)
print(f"\nTrain set        : {len(X_train)} samples")
print(f"Test set         : {len(X_test)} samples")

# ---------------------------------------------------------------------------
# Feature extraction — TF-IDF
# ---------------------------------------------------------------------------
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),        # unigrams + bigrams
    sublinear_tf=True,         # apply log normalisation
    strip_accents="unicode",
    analyzer="word",
    token_pattern=r"\w{2,}",   # min 2-char tokens, removes single chars
    min_df=1,
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf  = vectorizer.transform(X_test)

# ---------------------------------------------------------------------------
# Model — Multinomial Naive Bayes
# ---------------------------------------------------------------------------
model = MultinomialNB(alpha=0.5)   # Laplace smoothing = 0.5
model.fit(X_train_tfidf, y_train)

# ---------------------------------------------------------------------------
# Evaluation
# ---------------------------------------------------------------------------
y_pred = model.predict(X_test_tfidf)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n--- Evaluation on held-out test set ({len(X_test)} samples) ---")
print(f"Accuracy: {accuracy:.4f}")
print()
print(classification_report(y_test, y_pred, target_names=["safe", "phishing"]))

# ---------------------------------------------------------------------------
# Save model artifacts to models/ directory
# ---------------------------------------------------------------------------
MODELS_DIR = os.path.dirname(os.path.abspath(__file__))

model_path      = os.path.join(MODELS_DIR, "phishing_model.pkl")
vectorizer_path = os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl")

joblib.dump(model,      model_path)
joblib.dump(vectorizer, vectorizer_path)

print(f"\nModel saved      : {model_path}")
print(f"Vectorizer saved : {vectorizer_path}")

# ---------------------------------------------------------------------------
# Quick sanity-check predictions
# ---------------------------------------------------------------------------
SANITY_EXAMPLES = [
    ("Hey, are we still meeting for lunch at 12?", "safe"),
    ("URGENT! Your bank account has been suspended. Verify your OTP immediately.", "phishing"),
    ("Congratulations! You have won Rs. 10 lakhs! Claim now.", "phishing"),
    ("Your order has been shipped and will arrive by Friday.", "safe"),
    ("Click here to verify your account: http://secure-bank.xyz/verify", "phishing"),
    ("Team standup at 10am tomorrow.", "safe"),
]

print("\n--- Sanity-check predictions ---")
for text, expected in SANITY_EXAMPLES:
    vec = vectorizer.transform([text])
    pred = model.predict(vec)[0]
    proba = model.predict_proba(vec)[0]
    idx = list(model.classes_).index(pred)
    confidence = proba[idx]
    status = "OK" if pred == expected else "FAIL"
    print(f"  [{status}] pred={pred:<10} conf={confidence:.3f}  | {text[:65]}")

print("\nTraining complete.")
