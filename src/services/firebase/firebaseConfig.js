import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBKU25LxYznKdxEaBdzfTn2G-4hmu_Bgws",
  authDomain: "investment-tracker-18005.firebaseapp.com",
  projectId: "investment-tracker-18005",
  storageBucket: "investment-tracker-18005.firebasestorage.app",
  messagingSenderId: "580708521826",
  appId: "1:580708521826:web:faf78e9d8bfdfe77d6fe3b",
};

const app = initializeApp(firebaseConfig);

export default app;