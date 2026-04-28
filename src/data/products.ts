export type ProduceProduct = {
  id: string;
  name: string;
  season: string;
  description: string;
  unit: string;
  price: string;
  imageUrl: string;
  minimumQuantity?: number;
};

export const PRODUCE_PRODUCTS: ProduceProduct[] = [
  {
    id: "wild-blueberries",
    name: "Wild Blueberries",
    season: "Summer",
    description: "Small-batch wild blueberry harvest from the woodland parcel.",
    unit: "1 lb basket",
    price: "$12",
    imageUrl: "/images/properties/catskills-woodland-50ac/hero-blueberry-bushes.jpg",
  },
  {
    id: "orchard-fruit-box",
    name: "Orchard Fruit Box",
    season: "Late Summer to Fall",
    description: "Mixed seasonal orchard fruit from current available crop.",
    unit: "5 lb box",
    price: "$28",
    imageUrl:
      "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "maple-syrup",
    name: "Small-Batch Maple Syrup",
    season: "Spring",
    description: "Catskills maple syrup from seasonal sap collection.",
    unit: "16 oz bottle",
    price: "$18",
    imageUrl: "/images/products/maple-syrup-catskills-fall.png",
  },
  {
    id: "orchard-blossom-honey",
    name: "Honey (orchard blossom)",
    season: "Year-round (limited)",
    description: "Small-batch honey produced from orchard blossom forage.",
    unit: "12 oz jar",
    price: "$14",
    imageUrl: "/images/products/honey-orchard-blossom.png",
  },
  {
    id: "timithy-hay",
    name: "Timithy hay",
    season: "Pre-order",
    description: "Pre-order available. Minimum quantity is 500 bales.",
    unit: "50 lb bale",
    price: "$8",
    imageUrl: "/images/products/timithy-hay-square-bales.png",
    minimumQuantity: 500,
  },
  {
    id: "jersey-tea-bundles",
    name: "Jersey Tea bundles",
    season: "Seasonal",
    description: "Undried Jersey Tea bundles.",
    unit: "0.5 lbs bundle",
    price: "$5",
    imageUrl: "/images/products/jersey-tea-bundle.png",
  },
];
