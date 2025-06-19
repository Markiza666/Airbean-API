import menuData from '../data/menu.json' assert { type: 'json' };

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
