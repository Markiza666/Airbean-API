import fs from 'fs';   // Importerar Node.js File System module
import path from 'path'; // Importerar Node.js Path-modul för sökvägshantering
import { fileURLToPath } from 'url'; // För att få __dirname-funktionalitet i ES Modules

// --- Standardkod för att få __dirname-motsvarighet i ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- Slut på standardkod ---

// Konstruera sökvägen till din menu.json-fil
const menuPath = path.join(__dirname, '../data/menu.json');

// Läs in och tolka JSON-datan synkront vid uppstart
let menuData = [];
try {
    const rawData = fs.readFileSync(menuPath, 'utf8'); // Läs in filen som en sträng
    menuData = JSON.parse(rawData); // Tolka strängen som JSON
    console.log('Menydata laddad korrekt i valideringsmiddleware.'); // Valfritt: för felsökning
} catch (error) {
    console.error('Fel vid laddning av menydata i valideringsmiddleware:', error);
    // Om kritisk data som menyn inte kan laddas, är det bäst att avsluta processen
    process.exit(1);
}

// Nu kan valideringsfunktioner använda menuData
const validateMenuAndPrices = async (req, res, next) => {
    const orderedItems = req.body.items; 

    if (!orderedItems || !Array.isArray(orderedItems) || orderedItems.length === 0) { 
        return res.status(400).json({ error: "Beställningen är ogiltig eller tom." }); 
    } 

    const menuMap = new Map(menuData.map(item => [item.id, item]));
    for (const item of orderedItems) {
        const { product, quantity } = item;
        if (!menuMap.has(product.id)) {
        return res.status(400).json({ error: `Produkten med ID ${product.id} finns inte i menyn.` });
        }

        const menuItem = menuMap.get(product.id);
        if (product.title !== menuItem.title) { 
            return res.status(400).json({ error: `Titeln för produkt ${product.id} matchar inte menyn.` }); 
        } 

        if (product.price !== menuItem.price) { 
            return res.status(400).json({ error: `Priset för produkt ${product.id} (${product.price} SEK) matchar inte menyns pris (${menuItem.price} SEK).` }); 
        } 

        if (typeof quantity !== 'number' || quantity <= 0) { 
            return res.status(400).json({ error: `Kvantitet för produkt ${product.id} måste vara ett positivt nummer.` }); 
        } 

    }
    next();
};

export default validateMenuAndPrices;
