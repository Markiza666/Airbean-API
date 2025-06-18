const validateString = (value, fieldName) => { 
    if (typeof value !== 'string' || value.trim() === '') { 
        return `${fieldName} måste vara en icke-tom sträng.`; 
    } 
    return null; 
    }; 

const validateNumber = (value, fieldName) => { 
    if (typeof value !== 'number' || value <= 0) { 
        return `${fieldName} måste vara ett positivt nummer.`; 
    } return null;
}; 

// Validering för registrering 
export const validateRegistration = (req, res, next) => { 
    const { username, password } = req.body; 

    let error = validateString(username, 'Användarnamn'); 
    if (error) return res.status(400).json({ error }); 

    error = validateString(password, 'Lösenord'); 
    if (error) return res.status(400).json({ error }); 

    if (password.length < 6) { 
        return res.status(400).json({ error: "Lösenordet måste vara minst 6 tecken långt." }); 
    } 

    next(); 
}; 

// Validering för inloggning 
export const validateLogin = (req, res, next) => {  
    const { username, password } = req.body; 

    let error = validateString(username, 'Användarnamn'); 
    if (error) return res.status(400).json({ error }); 

    error = validateString(password, 'Lösenord'); 
    if (error) return res.status(400).json({ error }); 

    next(); 
}; 

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

export default { validateRegistration, validateLogin, validateNewOrder };
