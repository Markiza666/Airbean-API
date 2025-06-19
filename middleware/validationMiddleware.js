const validateString = (value, fieldName) => { 
    if (typeof value !== 'string' || value.trim() === '') { 
        return `${fieldName} måste vara en icke-tom sträng.`; 
    } 
    return null; 
    }; 

// Validering för registrering 
const validateRegistration = (req, res, next) => { 
    const { username, password } = req.body; 

    let error = validateString(username, 'Användarnamn'); 
    if (error) return res.status(400).json({ error }); 

    error = validateString(password, 'Lösenord'); 
    if (error) return res.status(400).json({ error }); 

    if (password.length < 8) {  // Ökat till minst 8 tecken för bättre säkerhet
        return res.status(400).json({ error: "Lösenordet måste vara minst 8 tecken långt." }); 
    } 

    // Nya regex-regler för lösenordskomplexitet:
    // Regex för minst en versal (A-Z)
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ error: "Lösenordet måste innehålla minst en versal bokstav." });
    }
    // Regex för minst en liten bokstav (a-z) - ofta bra att ha om man kräver versal
    if (!/[a-z]/.test(password)) {
        return res.status(400).json({ error: "Lösenordet måste innehålla minst en liten bokstav." });
    }
    // Regex för minst en siffra (0-9)
    if (!/[0-9]/.test(password)) {
        return res.status(400).json({ error: "Lösenordet måste innehålla minst en siffra." });
    }
    // Regex för minst ett specialtecken (t.ex. !@#$%^&*)
    // Du kan anpassa vilka specialtecken du tillåter/kräver
    if (!/[!@#$%^&*]/.test(password)) {
        return res.status(400).json({ error: "Lösenordet måste innehålla minst ett specialtecken (!@#$%^&*)." });
    }

    next(); 
}; 

// Validering för inloggning 
const validateLogin = (req, res, next) => {  
    const { username, password } = req.body; 

    let error = validateString(username, 'Användarnamn'); 
    if (error) return res.status(400).json({ error }); 

    error = validateString(password, 'Lösenord'); 
    if (error) return res.status(400).json({ error }); 

    next(); 
}; 

// Validering för ny order 
const validateNewOrder = (req, res, next) => {
    const { items } = req.body; 

    if (!Array.isArray(items) || items.length === 0) { 
        return res.status(400).json({ error: "Beställningen måste vara en icke-tom array av produkter." });
    } 

    for (const item of items) { 
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
