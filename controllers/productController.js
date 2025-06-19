import menuData from '../data/menu.json' assert { type: 'json' }; // Nytt sätt att importera JSON

const getMenu = async (req, res) => { // Namngiven export
  try {
    const menu = menuData;
    res.json(menu);
  } catch (error) {
    console.error("Kunde inte hämta menyn:", error.message || error); // Säkerställer att dvi får ut ett mer läsbart felmeddelande i konsolen om error är ett felobjekt med en message-egenskap.
    res.status(500).json({ error: "Serverfel vid hämtning av menyn." });
  }
};

export default getMenu;
