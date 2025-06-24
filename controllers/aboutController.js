/**
 * @desc    Hämtar statisk information för "Om"-sidan
 * @route   GET /api/about
 * @access  Public (ingen autentisering krävs)
 */
const getAboutInfo = (req, res) => {
    try {
        const aboutInfo = {
            title: "Vårt kaffe",
            subheading: "Pumpkin spice mug, barista cup, sit macchiato, kopi-luwak, doppio, grounds dripper, crema, strong whipped, variety extra iced id lungo half and half mazagran. Pumpkin spice.",
            description: `
                Que dark fair trade, spoon decaffeinated, barista wings whipped, as rich aftertaste, con panna milk black, arabica white rich beans single shot extra affogato. So affogato macchiato sit extraction instant grinder seasonal organic, turkish single shot, single origin, and robusta strong to go so dripper. Viennese froth, grounds caramelization skinny aromatic cup kopi-luwak, fair trade flavour, frappuccino medium, café au lait flavour cultivar ut bar instant kopi-luwak.

                Roast id macchiato, single shot siphon mazagran milk fair trade est aroma a half and half and, so, galão iced to go, whipped as cream cup pumpkin spice iced. At extra, rich grinder, brewed to go, steamed half and half at, that, percolator macchiato trifecta and body as arabica dripper. In galão black java milk sit trifecta, robusta, acerbic café au lait instant shop latte. Seasonal bar shop filter aroma id, crema, affogato viennese cultivar aftertaste, seasonal, percolator cream black, galão flavour, milk aromatic turkish skinny crema.
            `,
            ownerInfo: {
                name: "Eva Cortado", 
                role: "VD & Grundare", 
                imageUrl: "/images/owner.svg"
            }
        };

        res.status(200).json(aboutInfo);

    } catch (error) {
        console.error("Kunde inte hämta om-information:", error);
        res.status(500).json({ error: "Serverfel vid hämtning av företagsinformation." });
    }
};

export default getAboutInfo;
