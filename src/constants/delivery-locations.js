export const BAKU = "Bakı";

export const CITIES = [
  "Bakı",
  "Sumqayıt",
  "Gəncə",
  "Mingəçevir",
  "Naxçıvan",
  "Şəki",
  "Şirvan",
  "Lənkəran",
  "Yevlax",
  "Naftalan",
  "Xankəndi",
  "Abşeron",
  "Ağcabədi",
  "Ağdam",
  "Ağdaş",
  "Ağstafa",
  "Ağsu",
  "Astara",
  "Balakən",
  "Beyləqan",
  "Bərdə",
  "Biləsuvar",
  "Cəbrayıl",
  "Cəlilabad",
  "Culfa",
  "Daşkəsən",
  "Füzuli",
  "Gədəbəy",
  "Goranboy",
  "Göyçay",
  "Göygöl",
  "Hacıqabul",
  "İmişli",
  "İsmayıllı",
  "Kəlbəcər",
  "Kürdəmir",
  "Qax",
  "Qazax",
  "Qəbələ",
  "Qobustan",
  "Quba",
  "Qubadlı",
  "Qusar",
  "Laçın",
  "Lerik",
  "Masallı",
  "Neftçala",
  "Oğuz",
  "Ordubad",
  "Saatlı",
  "Sabirabad",
  "Salyan",
  "Samux",
  "Siyəzən",
  "Şabran",
  "Şamaxı",
  "Şəmkir",
  "Şərur",
  "Şuşa",
  "Tərtər",
  "Tovuz",
  "Ucar",
  "Xaçmaz",
  "Xızı",
  "Xocalı",
  "Xocavənd",
  "Yardımlı",
  "Zaqatala",
  "Zəngilan",
  "Zərdab",
];

export const BAKU_DISTRICTS = [
  "Binəqədi",
  "Nərimanov",
  "Nəsimi",
  "Nizami",
  "Pirallahı",
  "Qaradağ",
  "Sabunçu",
  "Səbail",
  "Suraxanı",
  "Xətai",
  "Xəzər",
  "Yasamal",
];

export function composeDeliveryAddress({ city, district, street, building, apartment }) {
  const parts = [];
  if (city) parts.push(city);
  if (city === BAKU && district) parts.push(`${district} rayonu`);
  const streetBuilding = [street, building].filter(Boolean).join(" ");
  if (streetBuilding) parts.push(streetBuilding);
  if (apartment) parts.push(`mənzil ${apartment}`);
  return parts.join(", ");
}

export function parseDeliveryAddress(addressStr) {
  if (!addressStr || typeof addressStr !== "string") return null;
  const parts = addressStr.split(",").map((p) => p.trim());
  if (parts.length === 0) return null;

  const result = {
    city: "",
    district: "",
    street: "",
    building: "",
    apartment: "",
    note: "",
  };

  const matchedCity = CITIES.find((c) => c.toLowerCase() === parts[0]?.toLowerCase());
  if (matchedCity) {
    result.city = matchedCity;
    parts.shift();
  }

  if (result.city === BAKU && parts[0]?.toLowerCase().includes("rayon")) {
    const rawDist = parts[0].replace(/\s*rayonu?/i, "").trim();
    const matchedDist = BAKU_DISTRICTS.find((d) => d.toLowerCase() === rawDist.toLowerCase());
    if (matchedDist) {
      result.district = matchedDist;
      parts.shift();
    }
  }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (/^mənzil\s+/i.test(part)) {
      result.apartment = part.replace(/^mənzil\s+/i, "").trim();
    } else if (!result.street) {
      const match = part.match(/^(.*?)(?:\s+(\d+[A-Za-zА-Яа-яƏəÖöÜüÇçŞşĞğ\/\-]*))$/);
      if (match) {
        result.street = match[1].trim();
        result.building = match[2].trim();
      } else {
        result.street = part;
      }
    } else if (!result.building) {
      result.building = part;
    }
  }

  return result;
}
