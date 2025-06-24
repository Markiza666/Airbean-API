const validateString = (value, fieldName) => {
    if (typeof value !== 'string' || value.trim() === '') {
        return `${fieldName} måste vara en icke-tom sträng.`;
    }
    return null;
};

// Validation for registration
const validateRegistration = (req, res, next) => {
    const { username, password } = req.body;

    let error = validateString(username, 'Användarnamn');
    if (error) return res.status(400).json({ error });

    error = validateString(password, 'Lösenord');
    if (error) return res.status(400).json({ error });

    if (password.length < 8) {  // At l,east 8 characters for better security
        return res.status(400).json({ error: "Lösenordet måste vara minst 8 tecken långt." });
    }

    // Regex-rules for password complexity

    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ error: "Lösenordet måste innehålla minst en versal bokstav." });
    }

    if (!/[a-z]/.test(password)) {
        return res.status(400).json({ error: "Lösenordet måste innehålla minst en liten bokstav." });
    }

    if (!/[0-9]/.test(password)) {
        return res.status(400).json({ error: "Lösenordet måste innehålla minst en siffra." });
    }

    if (!/[!@#$%^&*]/.test(password)) {
        return res.status(400).json({ error: "Lösenordet måste innehålla minst ett specialtecken (!@#$%^&*)." });
    }

    next();
};

// Validation for login
const validateLogin = (req, res, next) => {
    const { username, password } = req.body;

    let error = validateString(username, 'Användarnamn');
    if (error) return res.status(400).json({ error });

    error = validateString(password, 'Lösenord');
    if (error) return res.status(400).json({ error });

    next();
};

// Validation for new order 
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
