import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "haier-hwm110-688s8",
    name: "Haier HWM110-688S8 Automatic Washing Machine",
    slug: "haier-hwm110-688s8",
    categoryId: "automatic-washing-machine",
    brandId: "haier",
    price: 77000,
    image: "/images/acimages.webp",
    model: "HWM110-688S8",
    description:
      "11 KG automatic top-load washing machine with 6 wash programs and 1300 RPM spin speed.",
    specifications: {
      Capacity: "11 kg",
      Type: "Automatic, Top Load",
      Technology: "Non Inverter",
      "Wash Programs": "6 Programs",
      "Spin Speed": "1300 RPM",
      Color: "Black",
      Warranty: "1 Year",
    },
  },

  {
    id: "haier-hwm85-1269s6",
    name: "Haier HWM85-1269S6 Top Load Washing Machine",
    slug: "haier-hwm85-1269s6",
    categoryId: "automatic-washing-machine",
    brandId: "haier",
    price: 52000,
    image: "/images/products/haier-hwm85-1269s6.jpg",
    model: "HWM85-1269S6",
    description:
      "8.5 KG Haier top-load washing machine with digital controls and multiple wash functions.",
    specifications: {
      Capacity: "8.5 kg",
      Type: "Top Load",
      "Spin Speed": "1300 RPM",
      Color: "White",
      Warranty: "1 Year",
    },
  },

  {
    id: "dawlance-dw-md4n",
    name: "Dawlance DW-MD4N Microwave Oven",
    slug: "dawlance-dw-md4n",
    categoryId: "microwave",
    brandId: "dawlance",
    price: 17900,
    image: "/images/products/dawlance-dw-md4n.jpg",
    model: "DW-MD4N",
  },

  {
    id: "dawlance-dw-133g",
    name: "Dawlance DW-133G Microwave Oven with Grill",
    slug: "dawlance-dw-133g",
    categoryId: "microwave",
    brandId: "dawlance",
    price: 41000,
    image: "/images/products/dawlance-dw-133g.jpg",
    model: "DW-133G",
    description:
      "30 Liter Dawlance microwave oven with grill function and digital controls.",
    specifications: {
      Capacity: "30 Liter",
      Type: "Grill",
      "Grilling Power": "1000W",
      "Heating Power": "900W",
      Color: "Black",
      Warranty: "2 Years",
    },
  },
];