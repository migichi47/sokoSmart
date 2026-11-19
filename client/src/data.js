export const COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu",
  "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho",
  "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale",
  "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru",
  "Migori", "Mombasa", "Murang’a", "Nairobi", "Nakuru", "Nandi", "Narok",
  "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta",
  "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
  "Vihiga", "Wajir", "West Pokot",
];

export const TYPES = [
  ["Tomatoes", "🍅", "Vegetables"],
  ["Sukuma wiki (kale)", "🥬", "Vegetables"],
  ["Cabbages", "🥬", "Vegetables"],
  ["Onions", "🧅", "Vegetables"],
  ["Carrots", "🥕", "Vegetables"],
  ["Capsicum", "🫑", "Vegetables"],
  ["Potatoes", "🥔", "Vegetables"],
  ["Kienyeji chicken", "🐔", "Poultry"],
  ["Broilers", "🍗", "Poultry"],
  ["Eggs", "🥚", "Eggs"],
  ["Avocados", "🥑", "Fruits"],
  ["Bananas", "🍌", "Fruits"],
  ["Maize", "🌽", "Grains"],
  ["Other produce", "🌿", "Vegetables"],
];

export const CATEGORIES = ["All", "Vegetables", "Poultry", "Eggs", "Fruits", "Grains"];

export const CATEGORY_BACKGROUNDS = {
  Vegetables: "linear-gradient(150deg,#b9e6a0,#5fbf6a)",
  Poultry: "linear-gradient(150deg,#ffd9a8,#f0a05a)",
  Eggs: "linear-gradient(150deg,#fff1c2,#f6cf6b)",
  Fruits: "linear-gradient(150deg,#ffe0a3,#9ad66a)",
  Grains: "linear-gradient(150deg,#fbe9a0,#e0b84a)",
};

const review = (name, score, comment) => ({ name, score, comment });
const seedRows = [
  ["Tomatoes", "Kirinyaga", "Mwangi Fresh Farm", "0711000001", 60, "kg", "500 kg", "Ripe Roma tomatoes, picked at dawn.", [review("Achieng", 5, "Firm and juicy, delivered on time."), review("Brian", 4, "Good quality for my kiosk.")]],
  ["Kienyeji chicken", "Machakos", "Kamau Poultry", "0722000002", 850, "bird", "120 birds", "Free-range, grain fed, 4 months old.", [review("Mary", 5, "Tasty and well sized."), review("Otieno", 5, "Best kienyeji I have bought."), review("Zawadi", 4, "Fair price.")]],
  ["Eggs", "Nakuru", "Rift Layers", "0733000003", 420, "tray (30 eggs)", "80 trays", "Fresh from our layers every morning.", [review("Hotel Savanna", 5, "Consistent supply every week.")]],
  ["Sukuma wiki (kale)", "Kiambu", "Wanjiru Greens", "0744000004", 20, "bunch", "300 bunches", "Pesticide-free, harvested today.", [review("Faith", 4, "Fresh and clean."), review("Jomo", 5, "Great for my restaurant.")]],
  ["Cabbages", "Nyandarua", "Highland Growers", "0755000005", 45, "piece", "900 heads", "Big dense heads from Ol Kalou.", [review("Peter", 4, "Solid heads, little waste.")]],
  ["Avocados", "Murang’a", "Kiriaini Orchards", "0766000006", 15, "piece", "2000 pieces", "Hass avocados, export grade.", [review("Lucy", 5, "Creamy and perfectly ripe."), review("Ali", 5, "Excellent.")]],
  ["Broilers", "Kajiado", "Maasai Plains Poultry", "0777000007", 650, "bird", "200 birds", "Ready at 1.8 kg, vaccinated.", [review("Grace", 4, "Healthy birds.")]],
  ["Onions", "Nyandarua", "Njoro Onion Co.", "0788000008", 70, "kg", "3 tonnes", "Red onions, well cured.", []],
  ["Carrots", "Nakuru", "Molo Roots", "0799000009", 55, "kg", "1 tonne", "Sweet, washed carrots.", [review("Esther", 4, "Crunchy and sweet.")]],
  ["Potatoes", "Nyandarua", "Kinangop Spuds", "0700000010", 40, "kg", "10 tonnes", "Shangi potatoes, sorted by size.", [review("Kevin", 5, "Great for chips, very clean.")]],
];

export const SEED_LISTINGS = seedRows.map((row, index) => {
  const [type, county, seller, phone, price, unit, quantity, note, reviews] = row;
  const product = TYPES.find(([name]) => name === type);
  return {
    id: index + 1,
    type,
    emoji: product[1],
    category: product[2],
    county,
    seller,
    phone,
    price,
    unit,
    quantity,
    note,
    reviews,
    image: "",
    createdAt: index,
  };
});

export const averageRating = (listing) =>
  listing.reviews.length
    ? listing.reviews.reduce((total, item) => total + item.score, 0) / listing.reviews.length
    : 0;

export function readListings() {
  try {
    const stored = localStorage.getItem("shambasoko-v1");
    if (!stored) return SEED_LISTINGS;
    const listings = JSON.parse(stored);
    if (!Array.isArray(listings)) throw new Error("Saved listings are not a list.");
    return listings;
  } catch (error) {
    console.error("Could not load saved listings:", error);
    return SEED_LISTINGS;
  }
}

export function saveListings(listings) {
  localStorage.setItem("shambasoko-v1", JSON.stringify(listings));
}
