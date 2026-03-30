# 🚀 Turant
**Khana, Gaadi, ya PG? Bas Turant Karo.**

![Turant Banner](https://turant.vercel.app/_next/image?url=https%3A%2F%2Fik.imagekit.io%2Fbuilswb4k%2Fpublic%2Fcar.gif%3FupdatedAt%3D1763987936501&w=1200&q=75) ## 📖 Our Mission: We Walked the Streets so You Don't Have To
Finding accurate details for local services—from the nearest fruit seller to a reliable medical store—can be frustrating. Online maps often miss smaller shops, and phone numbers rarely work. 

**Turant** changes that. We are a simple, community-first local directory combined with a powerful AI-driven recommendation engine. Every listing is manually verified by our team. We walk the streets, check the shops, and update the data regularly so our users never have to guess.

---

## 🏢 The 5 Core Services

Turant provides instant, verified access to local daily needs across five distinct modules:

1. **🚕 City Travel & Cabs:** Find shared cabs and autos at affordable rates.
2. **🏠 PG & Hotels:** Compare rents, view room photos, and chat directly with landlords.
3. **🍔 Restaurant:** Browse daily menus from local dhabas, messes, and eateries.
4. **🛒 Grocery (Kirana):** Connect with nearby shops and send your list to check instant availability.
5. **💊 Medical & Pharmacy:** Upload your prescription for fast, reliable home delivery.

---

## ✨ The Technical "Secret Sauce": Personalized Discovery Engine
Turant is more than a directory; it learns what you need. We built a custom, privacy-first recommendation algorithm that tracks user behavior entirely on the client side without relying on heavy backend AI models.

* **NLP-Filtered Intent Tracking:** The app uses strict dictionary whitelists (e.g., `'AC', 'WIFI', 'Ertiga'`) to identify search intents.
* **Entity Noise Reduction:** If a user searches for a specific name (e.g., "Rajesh" or "Sharma Dhaba"), the NLP filter safely ignores it, ensuring the behavioral profile isn't polluted with noise.
* **Client-Side Vector Profiles:** Turant tracks the frequency of valid category searches using `localStorage` Hash Maps, building a mathematical "Preference Vector" unique to the user's device.
* **Dynamic Re-Ranking:** Every time a user opens a category or the Home Screen, our `getPersonalizedList` algorithm intercepts the database fetch, calculates a `matchScore` for every item based on the user's vector, and instantly sorts the UI to display highly preferred items at the top.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React / Next.js (App Router)
* **Styling:** Tailwind CSS
* **Database & Backend:** Supabase (PostgreSQL)
* **State Management:** React Hooks + Browser `localStorage` (for persistent user vectors)
* **Deployment:** Vercel

---

## 🚀 Getting Started

To run Turant locally on your machine, follow these steps:

### Prerequisites
* Node.js and npm installed.
* A Supabase account with the required tables (`Cabs`, `Restaurants`, `PGs`, etc.) configured.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/turant.git](https://github.com/yourusername/turant.git)
   cd turant
   
2.Install dependencies:
Bash
npm install
Set up environment variables:
Create a .env.local file in the root directory and add your Supabase credentials:

3.Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

4.Run the development server:
Bash
npm run dev

5.Open http://localhost:3000 in your browser to see the app!

📝 License
This project is MIT licensed.
