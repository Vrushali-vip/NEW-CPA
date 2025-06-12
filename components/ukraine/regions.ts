
export const ukraineRegionsWithCities: Record<string, string[]> = {
  "Kyiv": ["Kyiv City"],
  "Lviv": ["Lviv", "Drohobych", "Stryi"],
  "Kharkiv": ["Kharkiv", "Chuhuiv", "Izium"],
  "Odesa": ["Odesa", "Bilhorod-Dnistrovskyi", "Izmail"],
  "Dnipro": ["Dnipro", "Kryvyi Rih", "Pavlohrad"],
};

export const regionOptions = Object.keys(ukraineRegionsWithCities).map((region) => ({
  value: region,
  label: region,
}));

export const getCityOptions = (region: string | undefined) => {
  if (!region || !ukraineRegionsWithCities[region]) return [];
  return ukraineRegionsWithCities[region].map((city) => ({
    value: city,
    label: city,
  }));
};
