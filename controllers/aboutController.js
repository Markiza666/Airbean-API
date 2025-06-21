const getAboutInfo = (req, res) => {
  const aboutInfo = { // Ett JSON-objekt skapas
    companyName: "Airbean",
    owner: "The Coffee Enthusiasts Inc.",
    description: "Airbean is your premier destination for high-quality, drone-delivered coffee. We believe in bringing the best brew directly to your doorstep with unparalleled speed and convenience.",
    contactInfo: {
        email: "info@airbean.com",
        phone: "+46 70 123 45 67",
        address: "Coffee Street 1, 123 45 Coffeeville, Sweden"
    },
    mission: "To revolutionize coffee delivery through innovative technology and exceptional customer service.",
    foundingYear: 2023
    };
  res.status(200).json(aboutInfo); // Skickas som JSON
};

export {  getAboutInfo };
