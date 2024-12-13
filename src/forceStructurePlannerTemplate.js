// forceStructurePlannerTemplate.js

import Decimal from "decimal.js";

// Set decimal precision to handle large numbers accurately
Decimal.set({ precision: 50 });

// Define the initial forces data for the "Force Structure Planner" template
const forceStructurePlannerTemplate = [
  {
    id: "offensive_missile_forces",
    name: "Offensive missile forces",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Arash 2 drones": {
        budget: new Decimal(1e9), // $1,000,000,000
        min: new Decimal(0),
        max: new Decimal(5e9), // $5,000,000,000
        quantity: new Decimal(10000),
        unitCost: new Decimal(100000), // $100,000
      },
      "Shahed 136 drones": {
        budget: new Decimal(1e8), // $100,000,000
        min: new Decimal(0),
        max: new Decimal(5e8), // $500,000,000
        quantity: new Decimal(2000),
        unitCost: new Decimal(50000), // $50,000
      },
      "Tomahawk type cruise missiles": {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(1000000),
      },
      "Stealth cruise missiles": {
        budget: new Decimal(2e9),
        min: new Decimal(0),
        max: new Decimal(10e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(2000000),
      },
      "Strategic/ballistic missiles": {
        budget: new Decimal(5e9),
        min: new Decimal(0),
        max: new Decimal(25e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(5000000),
      },
    },
  },
  {
    id: "air_force",
    name: "Air force",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Fatter V-Bat tail sitter/VTOL/Interceptor UAVs": {
        budget: new Decimal(2e9),
        min: new Decimal(0),
        max: new Decimal(10e9),
        quantity: new Decimal(5000),
        unitCost: new Decimal(400000),
      },
      "500 lb payload UAV": {
        budget: new Decimal(5e8),
        min: new Decimal(0),
        max: new Decimal(2.5e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(500000),
      },
      "100-250 lb payload UAV": {
        budget: new Decimal(5e8),
        min: new Decimal(0),
        max: new Decimal(2.5e9),
        quantity: new Decimal(5000),
        unitCost: new Decimal(100000),
      },
      "Rotary wing UAV/Returnable munitions": {
        budget: new Decimal(3e8),
        min: new Decimal(0),
        max: new Decimal(1.5e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(300000),
      },
      "Traditional tactical aircraft": {
        budget: new Decimal(10e9),
        min: new Decimal(0),
        max: new Decimal(50e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(10000000),
      },
      "Traditional fighter/light attack aircraft": {
        budget: new Decimal(30e9),
        min: new Decimal(0),
        max: new Decimal(150e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(30000000),
      },
      "Manned guided aerial munitions": {
        budget: new Decimal(5e9),
        min: new Decimal(0),
        max: new Decimal(25e9),
        quantity: new Decimal(100000),
        unitCost: new Decimal(50000),
      },
      "Unmanned aerial munitions": {
        budget: new Decimal(3e9),
        min: new Decimal(0),
        max: new Decimal(15e9),
        quantity: new Decimal(100000),
        unitCost: new Decimal(30000),
      },
      "Apache type helicopters": {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(100),
        unitCost: new Decimal(10000000),
      },
      "Airmobile helicopters": {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(100),
        unitCost: new Decimal(10000000),
      },
      "High-performance light attack drones": {
        budget: new Decimal(3e9),
        min: new Decimal(0),
        max: new Decimal(15e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(3000000),
      },
      Transport: {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(100),
        unitCost: new Decimal(10000000),
      },
      Logistics: {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(100),
        unitCost: new Decimal(10000000),
      },
    },
  },
  {
    id: "airship_force",
    name: "Airship force",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Large ship balloon ops (>500,000cf)": {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(1000000),
      },
      "Small balloon ops (<500,000cf)": {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(10000),
        unitCost: new Decimal(100000),
      },
    },
  },
  {
    id: "infantry_forces",
    name: "Infantry forces",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Infantry drone systems": {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(100000),
        unitCost: new Decimal(10000),
      },
      "MANPADS systems": {
        budget: new Decimal(9e8),
        min: new Decimal(0),
        max: new Decimal(4.5e9),
        quantity: new Decimal(30000),
        unitCost: new Decimal(30000),
      },
      "AT defense systems": {
        budget: new Decimal(9e8),
        min: new Decimal(0),
        max: new Decimal(4.5e9),
        quantity: new Decimal(30000),
        unitCost: new Decimal(30000),
      },
      "Infantry rifles and equipment": {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(1000000),
        unitCost: new Decimal(1000),
      },
      "High-quality infantry drones": {
        budget: new Decimal(1.5e9),
        min: new Decimal(0),
        max: new Decimal(7.5e9),
        quantity: new Decimal(50000),
        unitCost: new Decimal(30000),
      },
      "Crew served weapons": {
        budget: new Decimal(1e8),
        min: new Decimal(0),
        max: new Decimal(5e8),
        quantity: new Decimal(10000),
        unitCost: new Decimal(10000),
      },
    },
  },
  {
    id: "mobile_forces",
    name: "Mobile forces",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Humvee type vehicles": {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(10000),
        unitCost: new Decimal(100000),
      },
      "Uparmored tactical vehicles": {
        budget: new Decimal(4e8),
        min: new Decimal(0),
        max: new Decimal(2e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(400000),
      },
      "APC/IFV vehicles": {
        budget: new Decimal(10e9),
        min: new Decimal(0),
        max: new Decimal(50e9),
        quantity: new Decimal(2000),
        unitCost: new Decimal(5000000),
      },
    },
  },
  {
    id: "artillery_forces_rocket",
    name: "Artillery forces - Rocket artillery",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Rocket artillery units": {
        budget: new Decimal(3e9),
        min: new Decimal(0),
        max: new Decimal(15e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(3000000),
      },
      "Guided ammo": {
        budget: new Decimal(6e9),
        min: new Decimal(0),
        max: new Decimal(30e9),
        quantity: new Decimal(200000),
        unitCost: new Decimal(30000),
      },
    },
  },
  {
    id: "artillery_forces_gun",
    name: "Artillery forces - Gun artillery",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Gun artillery": {
        budget: new Decimal(2e9),
        min: new Decimal(0),
        max: new Decimal(10e9),
        quantity: new Decimal(2000),
        unitCost: new Decimal(1000000),
      },
      "Gun artillery-Mortars": {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(1000000),
      },
      Shells: {
        budget: new Decimal(10e9),
        min: new Decimal(0),
        max: new Decimal(50e9),
        quantity: new Decimal(1000000),
        unitCost: new Decimal(10000),
      },
      "Smart/accurate shells": {
        budget: new Decimal(10e9),
        min: new Decimal(0),
        max: new Decimal(50e9),
        quantity: new Decimal(200000),
        unitCost: new Decimal(50000),
      },
    },
  },
  {
    id: "armor_forces",
    name: "Armor forces",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Export model tanks": {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(1000000),
      },
      "Decent tanks": {
        budget: new Decimal(10e9),
        min: new Decimal(0),
        max: new Decimal(50e9),
        quantity: new Decimal(2000),
        unitCost: new Decimal(5000000),
      },
      "Bridge layer/specialist vehicles": {
        budget: new Decimal(5e8),
        min: new Decimal(0),
        max: new Decimal(2.5e9),
        quantity: new Decimal(100),
        unitCost: new Decimal(5000000),
      },
      "Trench/common engineer vehicles": {
        budget: new Decimal(1e8),
        min: new Decimal(0),
        max: new Decimal(5e8),
        quantity: new Decimal(100),
        unitCost: new Decimal(1000000),
      },
    },
  },
  {
    id: "logistics",
    name: "Logistics",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Heavy and medium tactical vehicles": {
        budget: new Decimal(3e8),
        min: new Decimal(0),
        max: new Decimal(1.5e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(300000),
      },
      "Semis, trailers, and tankers": {
        budget: new Decimal(3e8),
        min: new Decimal(0),
        max: new Decimal(1.5e9),
        quantity: new Decimal(1000),
        unitCost: new Decimal(300000),
      },
    },
  },
  {
    id: "radar_and_air_defense",
    name: "Radar and air defense and Defensive missile force",
    total: new Decimal(0),
    expanded: true,
    items: {
      "Cheap, grid-style radar": {
        budget: new Decimal(5e8),
        min: new Decimal(0),
        max: new Decimal(2.5e9),
        quantity: new Decimal(10000),
        unitCost: new Decimal(50000),
      },
      "Power, engineering, comms equipment": {
        budget: new Decimal(1e8),
        min: new Decimal(0),
        max: new Decimal(5e8),
        quantity: new Decimal(10000),
        unitCost: new Decimal(10000),
      },
      "Traditional air defense batteries": {
        budget: new Decimal(5e9),
        min: new Decimal(0),
        max: new Decimal(25e9),
        quantity: new Decimal(10),
        unitCost: new Decimal(500000000),
      },
      "Missile defense batteries": {
        budget: new Decimal(5e9),
        min: new Decimal(0),
        max: new Decimal(25e9),
        quantity: new Decimal(10),
        unitCost: new Decimal(500000000),
      },
      "Tactical/point air defense battalions": {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(20),
        unitCost: new Decimal(50000000),
      },
      "Strategic radar/air defense sites": {
        budget: new Decimal(1e9),
        min: new Decimal(0),
        max: new Decimal(5e9),
        quantity: new Decimal(10),
        unitCost: new Decimal(100000000),
      },
    },
  },
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

export default forceStructurePlannerTemplate;
