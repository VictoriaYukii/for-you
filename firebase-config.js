// Firebase configuration template.
// 1) Create a Firebase project at https://console.firebase.google.com/
// 2) Enable Firestore and Storage, and enable Authentication (Google or Email)
// 3) Replace the placeholder config below with your project's config object.
// 4) Set OWNER_UID to your Firebase user UID (from Auth user detail) to restrict writes.

window.FIREBASE_CONFIG = null; // e.g. { apiKey: '...', authDomain: '...', projectId: '...', storageBucket: '...', messagingSenderId: '...', appId: '...' }
window.FIREBASE_OWNER_UID = null; // e.g. 'abcd1234...'
// Optional local owner passphrase (ONLY use for local testing). If set, visitors who enter
// this passphrase can be treated as the owner on this device (no server auth).
// Set to null to disable local pass.
window.LOCAL_OWNER_PASS = 'VictoriaMyPrettyGirl'; // e.g. 'my-secret-pass'

// Example (do NOT keep these values):
// window.FIREBASE_CONFIG = {
//   apiKey: "...",
//   authDomain: "...",
//   projectId: "...",
//   storageBucket: "...",
//   messagingSenderId: "...",
//   appId: "..."
// };
// window.FIREBASE_OWNER_UID = 'your-owner-uid-here';
