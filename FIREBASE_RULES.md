Firestore rules (example) — open Firebase Console > Firestore > Rules and paste:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /entries/{docId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == '<OWNER_UID>';
      allow update, delete: if request.auth != null && request.auth.uid == '<OWNER_UID>';
    }
  }
}

Storage rules (open Firebase Console > Storage > Rules):

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /entries/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == '<OWNER_UID>';
    }
  }
}

Replace <OWNER_UID> with your user UID (from Auth). Alternatively, use custom claims for admin checks.