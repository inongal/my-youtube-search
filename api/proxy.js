export default async function handler(req, res) {
    // הגדרות אבטחה (CORS) - מאפשר לאתר שלך בגיטהאב לדבר עם השרת בוורסל
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // אפשר להגביל לכתובת הגיטהאב שלך לאבטחה מוגברת
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // טיפול בבקשת "לחיצת יד" מקדימה של הדפדפן
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // חסימת בקשות רגילות שחושפות מידע ב-URL
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests are allowed for privacy' });
    }

    // חילוץ הנתונים המוצפנים מגוף הבקשה
    const { endpoint, params, apiKey } = req.body;

    if (!endpoint || !apiKey) {
        return res.status(400).json({ error: 'Missing endpoint or API key' });
    }

    // הרכבת הבקשה האמיתית ליוטיוב מתוך השרת של Vercel
    const queryParams = new URLSearchParams({ ...params, key: apiKey }).toString();
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/${endpoint}?${queryParams}`;

    try {
        const response = await fetch(youtubeUrl);
        const data = await response.json();
        
        // החזרת הנתונים לדפדפן
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from YouTube' });
    }
}
