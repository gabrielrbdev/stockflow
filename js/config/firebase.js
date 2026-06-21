// ══════════════════════════════════════════════
//  StockFlow | Configuração Firebase
// ══════════════════════════════════════════════

import { initializeApp }   from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth }         from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore }    from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey:            "AIzaSyBwR777V1L9W59tehN5JCOsWalep576u0U",
    authDomain:        "stockflow-40cec.firebaseapp.com",
    projectId:         "stockflow-40cec",
    storageBucket:     "stockflow-40cec.firebasestorage.app",
    messagingSenderId: "445150768122",
    appId:             "1:445150768122:web:e1ddd8b02c994c461c9243"
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export { firebaseConfig };
