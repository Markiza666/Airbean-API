// Validering för ny order 
export const validateNewOrder = (req, res, next) => {
    const { order } = req.body; 

    if (!Array.isArray(order) || order.length === 0) { 
        return res.status(400).json({ error: "Beställningen måste vara en icke-tom array av produkter." });
    } 

    for (const item of order) { 
        const { product, quantity } = item; 
        if (!product || typeof product !== 'object' || !product.id || !product.title || typeof product.price !== 'number') { 
            return res.status(400).json({ error: "Varje produkt i beställningen måste ha id, title och price som nummer." }); 
        } 
        if (typeof quantity !== 'number' || quantity <= 0) { 
            return res.status(400).json({ error: `Kvantitet för produkt ${product.id} måste vara ett positivt nummer.` }); 
        } 
    } 
    next(); 
};
