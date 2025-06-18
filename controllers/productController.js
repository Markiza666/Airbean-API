import menuData from '../data/menu.json' assert { type: 'json' }; // Nytt sätt att importera JSON

const getMenu = async (req, res) => { // Namngiven export
  try {
    const menu = menuData;
    res.json(menu);
  } catch (error) {
    console.error("Kunde inte hämta menyn:", error);
    res.status(500).json({ error: "Serverfel vid hämtning av menyn." });
  }
};

export default getMenu;
