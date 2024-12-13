// defaultTemplate.js

import Decimal from "decimal.js";

Decimal.set({ precision: 50 });

const defaultTemplate = [
  {
    id: `custom_group_1`,
    name: "Custom Group 1",
    total: new Decimal(0),
    expanded: true,
    numItems: 10,
    items: Array.from({ length: 10 }, (_, i) => ({
      name: `Custom Item ${i + 1}`,
      budget: new Decimal(0),
      min: new Decimal(0),
      max: new Decimal(100e9),
      quantity: new Decimal(0),
      unitCost: new Decimal(1000000), // $1,000,000
    })),
  },
];

export default defaultTemplate;
