import fs from 'fs'; // Import Node.js File System module
import path from 'path'; // Import Node.js Path module for handling file paths
import { fileURLToPath } from 'url'; // For __dirname equivalent in ES Modules

// --- Start: Standard boilerplate to get __dirname equivalent in ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- End: Standard boilerplate ---

// Construct the path to your menu.json file
const menuPath = path.join(__dirname, '../data/menu.json');

// Read and parse the JSON data synchronously
let menuData = [];
try {
    const rawData = fs.readFileSync(menuPath, 'utf8');
    menuData = JSON.parse(rawData);
    console.log('Menu data loaded successfully.'); // Optional: for debugging
} catch (error) {
    console.error('Error loading menu data:', error);
    // Handle error: maybe exit the process, or use a default empty menu
    process.exit(1); // Exit if critical data cannot be loaded
}

// Now, your controller functions can use menuData
const getMenu = (req, res) => {
    res.status(200).json(menuData);
};

const getProductById = (req, res) => {
    const { id } = req.params;
    const product = menuData.find(item => item.id === id);
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ message: 'Produkt hittades inte.' });
    }
};

export { getMenu, getProductById};
