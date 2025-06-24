import fs from 'fs';   // Imports Node.js File System module
import path from 'path'; // Imports Node.js Path-module for path management
import { fileURLToPath } from 'url'; // To get __dirname functionality in ES Modules

// To get__dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Construct the path to your menu.json file
const menuPath = path.join(__dirname, '../data/menu.json');

//Read and parse the JSON data synchronously during startup
let menuData = [];
try {
    const rawData = fs.readFileSync(menuPath, 'utf8'); // Read file as a string
    menuData = JSON.parse(rawData); // Parse the string as JSON
    console.log('Menydata laddad korrekt i valideringsmiddleware.'); // For debugging
} catch (error) {
    console.error('Fel vid laddning av menydata i valideringsmiddleware:', error);
    // If not loaded, exit the process
    process.exit(1);
}

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
