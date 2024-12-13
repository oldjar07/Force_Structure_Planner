// ForceStructurePlanner.jsx

import React, { useState, useEffect } from "react";
import Decimal from "decimal.js";
import { NumericFormat } from "react-number-format";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import forceStructurePlannerTemplate from "./forceStructurePlannerTemplate";
import "./ForceStructurePlanner.css";

// Set decimal precision to handle large numbers accurately
Decimal.set({ precision: 50 });

const ForceStructurePlanner = () => {
  const MAX_TOTAL_BUDGET = new Decimal(1e12); // $1 Trillion
  const MAX_CUSTOM_GROUPS = 50; // Allow up to 50 groupings
  const MAX_ITEMS_PER_GROUP = 20;
  const MIN_ITEMS_PER_GROUP = 1;

  // Define the scale units and their multipliers
  const SCALE_UNITS = {
    Standard: new Decimal(1),
    Thousands: new Decimal(1e3),
    Millions: new Decimal(1e6),
    Billions: new Decimal(1e9),
    Trillions: new Decimal(1e12),
  };

  // Define abbreviations for scale units
  const SCALE_ABBREVIATIONS = {
    Standard: "",
    Thousands: "K",
    Millions: "M",
    Billions: "B",
    Trillions: "T",
  };

  const [scale, setScale] = useState("Billions"); // Default scale
  const [totalBudgetLimit, setTotalBudgetLimit] = useState(new Decimal(143e9)); // $143B from your spreadsheet total
  const [customGroupCount, setCustomGroupCount] = useState(1);
  const [groupNameEdits, setGroupNameEdits] = useState({});

  // State to limit budget warnings
  const [hasShownBudgetWarning, setHasShownBudgetWarning] = useState(false);

  const [forces, setForces] = useState(forceStructurePlannerTemplate);
  const [totalAllocated, setTotalAllocated] = useState(new Decimal(0));

  // State for chart data
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const newTotal = forces.reduce(
      (sum, force) => sum.add(calculateForceTotal(force)),
      new Decimal(0)
    );
    setTotalAllocated(newTotal);

    // Prepare data for pie chart (including Remaining Budget)
    const pieData = forces.map((force) => {
      return {
        name: force.name,
        value: parseFloat(calculateSubtotal(force).toFixed(2)),
      };
    });

    // Calculate remaining budget
    const remainingBudget = totalBudgetLimit.minus(newTotal);
    pieData.push({
      name: "Remaining Budget",
      value: remainingBudget.greaterThan(0)
        ? parseFloat(remainingBudget.toFixed(2))
        : 0,
    });

    setPieChartData(pieData);

    // Prepare data for bar chart (excluding Remaining Budget)
    const barData = forces.map((force) => {
      return {
        name: force.name,
        value: parseFloat(calculateSubtotal(force).toFixed(2)),
      };
    });

    setBarChartData(barData);

    // Reset budget warning if totalAllocated goes below limit
    if (newTotal.lte(totalBudgetLimit)) {
      setHasShownBudgetWarning(false);
    }
  }, [forces, totalBudgetLimit]);

  const calculateForceTotal = (force) => {
    const total = Array.isArray(force.items)
      ? force.items.reduce(
          (sum, item) => sum.add(item.budget || new Decimal(0)),
          new Decimal(0)
        )
      : Object.values(force.items).reduce(
          (sum, item) => sum.add(item.budget || new Decimal(0)),
          new Decimal(0)
        );
    return total;
  };

  const calculateSubtotal = (force) => calculateForceTotal(force);

  const createNewCustomGroup = () => {
    if (customGroupCount >= MAX_CUSTOM_GROUPS) {
      alert(`You can only have up to ${MAX_CUSTOM_GROUPS} custom groups.`);
      return;
    }

    const newCustomGroup = {
      id: `custom_group_${customGroupCount + 1}`,
      name: `Custom Group ${customGroupCount + 1}`,
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
    };

    setCustomGroupCount((prevCount) => prevCount + 1);
    setForces((prevForces) => [...prevForces, newCustomGroup]);
  };

  const handleGroupNameChange = (groupId, newName) => {
    setGroupNameEdits((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        name: newName,
      },
    }));
  };

  const updateGroupName = (groupId) => {
    const newName = groupNameEdits[groupId]?.name || "";
    if (!newName.trim()) return;

    setForces((prevForces) =>
      prevForces.map((force) =>
        force.id === groupId ? { ...force, name: newName } : force
      )
    );

    setGroupNameEdits((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        isEditing: false,
      },
    }));
  };

  const deleteCustomGroup = (groupId) => {
    setForces((prevForces) =>
      prevForces.filter((force) => force.id !== groupId)
    );
    setCustomGroupCount((prevCount) => prevCount - 1);
  };

  const handleNumItemsChange = (groupId, newNumItems) => {
    newNumItems = Math.max(
      MIN_ITEMS_PER_GROUP,
      Math.min(MAX_ITEMS_PER_GROUP, newNumItems)
    );
    setForces((prevForces) =>
      prevForces.map((force) => {
        if (force.id !== groupId) return force;

        let updatedItems = [...force.items];

        if (newNumItems < force.items.length) {
          updatedItems = updatedItems.slice(0, newNumItems);
        } else if (newNumItems > force.items.length) {
          const itemsToAdd = Array.from(
            { length: newNumItems - force.items.length },
            (_, i) => ({
              name: `Custom Item ${force.items.length + i + 1}`,
              budget: new Decimal(0),
              min: new Decimal(0),
              max: new Decimal(100e9),
              quantity: new Decimal(0),
              unitCost: new Decimal(1000000), // $1,000,000
            })
          );
          updatedItems = [...updatedItems, ...itemsToAdd];
        }

        return { ...force, numItems: newNumItems, items: updatedItems };
      })
    );
  };

  const toggleExpand = (groupId) => {
    setForces((prevForces) =>
      prevForces.map((force) =>
        force.id === groupId ? { ...force, expanded: !force.expanded } : force
      )
    );
  };

  // Updated formatBudget function with Decimal handling
  const formatBudget = (value, decimalPlaces = 2) => {
    const multiplier = SCALE_UNITS[scale];
    const scaledValue = value.div(multiplier);
    const abbreviation = SCALE_ABBREVIATIONS[scale];
    return `$${formatNumber(
      scaledValue.toFixed(decimalPlaces)
    )}${abbreviation}`;
  };

  // Function to format numbers with commas
  const formatNumber = (numberString) => {
    const parts = numberString.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const getScaledBudget = (value) => {
    const multiplier = SCALE_UNITS[scale];
    return value.div(multiplier).toNumber();
  };

  const parseNumberInput = (input) => {
    return new Decimal(input || "0");
  };

  const updateBudget = (groupId, itemKey, newBudget) => {
    setForces((prevForces) =>
      prevForces.map((force) => {
        if (force.id !== groupId) return force;

        let updatedItems;
        if (Array.isArray(force.items)) {
          const item = force.items[itemKey];
          const budgetDiff = newBudget.minus(item.budget);

          const newTotalAllocated = totalAllocated.plus(budgetDiff);

          if (newTotalAllocated.lte(totalBudgetLimit)) {
            const newQuantity = newBudget.div(item.unitCost).floor();

            updatedItems = force.items.map((itm, index) =>
              index === itemKey
                ? {
                    ...itm,
                    budget: newBudget,
                    quantity: newQuantity,
                  }
                : itm
            );
          } else {
            if (!hasShownBudgetWarning) {
              alert("Cannot allocate budget. Exceeds total budget limit.");
              setHasShownBudgetWarning(true);
            }
            // Allow exceeding the budget
            const newQuantity = newBudget.div(item.unitCost).floor();
            updatedItems = force.items.map((itm, index) =>
              index === itemKey
                ? {
                    ...itm,
                    budget: newBudget,
                    quantity: newQuantity,
                  }
                : itm
            );
          }
        } else {
          const item = force.items[itemKey];
          const budgetDiff = newBudget.minus(item.budget);

          const newTotalAllocated = totalAllocated.plus(budgetDiff);

          if (newTotalAllocated.lte(totalBudgetLimit)) {
            const newQuantity = newBudget.div(item.unitCost).floor();

            updatedItems = {
              ...force.items,
              [itemKey]: {
                ...item,
                budget: newBudget,
                quantity: newQuantity,
              },
            };
          } else {
            if (!hasShownBudgetWarning) {
              alert("Cannot allocate budget. Exceeds total budget limit.");
              setHasShownBudgetWarning(true);
            }
            // Allow exceeding the budget
            const newQuantity = newBudget.div(item.unitCost).floor();
            updatedItems = {
              ...force.items,
              [itemKey]: {
                ...item,
                budget: newBudget,
                quantity: newQuantity,
              },
            };
          }
        }

        return { ...force, items: updatedItems };
      })
    );
  };

  // Updated handleQuantityChange using NumericFormat
  const handleQuantityChange = (value, forceId, itemKey) => {
    const newQuantity = new Decimal(value || "0").floor();

    setForces((prevForces) =>
      prevForces.map((force) => {
        if (force.id !== forceId) return force;

        let updatedItems;
        if (Array.isArray(force.items)) {
          const newBudget = newQuantity
            .mul(force.items[itemKey].unitCost)
            .toDecimalPlaces(2);

          const budgetDiff = newBudget.minus(force.items[itemKey].budget);
          const newTotalAllocated = totalAllocated.plus(budgetDiff);

          if (newTotalAllocated.lte(totalBudgetLimit)) {
            updatedItems = force.items.map((item, index) =>
              index === itemKey
                ? {
                    ...item,
                    quantity: newQuantity,
                    budget: newBudget,
                  }
                : item
            );
          } else {
            if (!hasShownBudgetWarning) {
              alert("Cannot allocate budget. Exceeds total budget limit.");
              setHasShownBudgetWarning(true);
            }
            // Allow exceeding the budget
            updatedItems = force.items.map((item, index) =>
              index === itemKey
                ? {
                    ...item,
                    quantity: newQuantity,
                    budget: newBudget,
                  }
                : item
            );
          }
        } else {
          const newBudget = newQuantity
            .mul(force.items[itemKey].unitCost)
            .toDecimalPlaces(2);

          const budgetDiff = newBudget.minus(force.items[itemKey].budget);
          const newTotalAllocated = totalAllocated.plus(budgetDiff);

          if (newTotalAllocated.lte(totalBudgetLimit)) {
            updatedItems = {
              ...force.items,
              [itemKey]: {
                ...force.items[itemKey],
                quantity: newQuantity,
                budget: newBudget,
              },
            };
          } else {
            if (!hasShownBudgetWarning) {
              alert("Cannot allocate budget. Exceeds total budget limit.");
              setHasShownBudgetWarning(true);
            }
            // Allow exceeding the budget
            updatedItems = {
              ...force.items,
              [itemKey]: {
                ...force.items[itemKey],
                quantity: newQuantity,
                budget: newBudget,
              },
            };
          }
        }

        return { ...force, items: updatedItems };
      })
    );
  };

  // Updated handleUnitCostChange using NumericFormat
  const handleUnitCostChange = (value, forceId, itemKey) => {
    const newUnitCost = new Decimal(value || "0").toDecimalPlaces(2);

    setForces((prevForces) =>
      prevForces.map((force) => {
        if (force.id !== forceId) return force;

        let updatedItems;
        if (Array.isArray(force.items)) {
          const newBudget = force.items[itemKey].quantity
            .mul(newUnitCost)
            .toDecimalPlaces(2);

          const budgetDiff = newBudget.minus(force.items[itemKey].budget);
          const newTotalAllocated = totalAllocated.plus(budgetDiff);

          if (newTotalAllocated.lte(totalBudgetLimit)) {
            updatedItems = force.items.map((item, index) =>
              index === itemKey
                ? {
                    ...item,
                    unitCost: newUnitCost,
                    budget: newBudget,
                  }
                : item
            );
          } else {
            if (!hasShownBudgetWarning) {
              alert("Cannot allocate budget. Exceeds total budget limit.");
              setHasShownBudgetWarning(true);
            }
            // Allow exceeding the budget
            updatedItems = force.items.map((item, index) =>
              index === itemKey
                ? {
                    ...item,
                    unitCost: newUnitCost,
                    budget: newBudget,
                  }
                : item
            );
          }
        } else {
          const newBudget = force.items[itemKey].quantity
            .mul(newUnitCost)
            .toDecimalPlaces(2);

          const budgetDiff = newBudget.minus(force.items[itemKey].budget);
          const newTotalAllocated = totalAllocated.plus(budgetDiff);

          if (newTotalAllocated.lte(totalBudgetLimit)) {
            updatedItems = {
              ...force.items,
              [itemKey]: {
                ...force.items[itemKey],
                unitCost: newUnitCost,
                budget: newBudget,
              },
            };
          } else {
            if (!hasShownBudgetWarning) {
              alert("Cannot allocate budget. Exceeds total budget limit.");
              setHasShownBudgetWarning(true);
            }
            // Allow exceeding the budget
            updatedItems = {
              ...force.items,
              [itemKey]: {
                ...force.items[itemKey],
                unitCost: newUnitCost,
                budget: newBudget,
              },
            };
          }
        }

        return { ...force, items: updatedItems };
      })
    );
  };

  // Set a fixed small step size for budget sliders
  const getBudgetStep = () => {
    return 0.000001; // Fixed step size in scaled units
  };

  // Generate a color palette for up to 50 groups
  const generateColorPalette = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = (i * 137.508) % 360; // golden angle approximation
      colors.push(`hsl(${hue}, 65%, 50%)`);
    }
    return colors;
  };

  const COLORS_PALETTE = generateColorPalette(50);

  return (
    <div className="force-planner">
      <header className="header">
        <h1>Force Structure Planning Tool</h1>

        {/* Charts */}
        <div className="charts-container">
          {/* Pie Chart */}
          <div className="chart">
            <h3>Budget Allocation - Pie Chart</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110} // Set outerRadius to 110
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-pie-${index}`}
                      fill={
                        entry.name === "Remaining Budget"
                          ? "#d3d3d3" // Greyish color for Remaining Budget
                          : COLORS_PALETTE[index % COLORS_PALETTE.length]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    formatBudget(new Decimal(value)),
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="chart">
            <h3>Budget Allocation - Bar Chart</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 20, left: 60 }} // Increased left margin
              >
                <XAxis dataKey="name" tick={false} />
                <YAxis
                  tickFormatter={(value) => formatBudget(new Decimal(value), 0)}
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatBudget(new Decimal(value)),
                    name,
                  ]}
                />
                <Bar dataKey="value">
                  {barChartData.map((entry, index) => (
                    <Cell
                      key={`cell-bar-${index}`}
                      fill={COLORS_PALETTE[index % COLORS_PALETTE.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Existing content */}
        <div>
          Total Budget: {formatBudget(totalBudgetLimit)} | Allocated:{" "}
          {formatBudget(totalAllocated)} | Remaining:{" "}
          {formatBudget(totalBudgetLimit.minus(totalAllocated))}
        </div>

        <div className="budget-slider">
          <label>Adjust Total Budget:</label>
          <input
            type="range"
            value={getScaledBudget(totalBudgetLimit)}
            min={0}
            max={getScaledBudget(MAX_TOTAL_BUDGET)}
            step={getBudgetStep()}
            onChange={(e) => {
              const newTotalBudgetScaled = new Decimal(e.target.value);
              const newTotalBudget = newTotalBudgetScaled.mul(
                SCALE_UNITS[scale]
              );
              setTotalBudgetLimit(newTotalBudget);
            }}
          />
          <div>
            Range: {formatBudget(new Decimal(0))} -{" "}
            {formatBudget(MAX_TOTAL_BUDGET)}
          </div>
        </div>
        <div className="scale-selector">
          <label>Scale: </label>
          <select value={scale} onChange={(e) => setScale(e.target.value)}>
            {Object.keys(SCALE_UNITS).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </header>
      <div className="content">
        {forces.map((force) => (
          <div key={force.id} className="force-section">
            <div className="force-header">
              <div
                className="force-title"
                onClick={() => toggleExpand(force.id)}
                style={{ textAlign: "center", cursor: "pointer" }}
              >
                {force.id.startsWith("custom_group") ? (
                  groupNameEdits[force.id]?.isEditing ? (
                    <input
                      type="text"
                      value={groupNameEdits[force.id].name}
                      onChange={(e) =>
                        handleGroupNameChange(force.id, e.target.value)
                      }
                      onBlur={() => {
                        if (groupNameEdits[force.id].name.trim() !== "") {
                          updateGroupName(force.id);
                        } else {
                          setGroupNameEdits((prev) => ({
                            ...prev,
                            [force.id]: {
                              ...prev[force.id],
                              isEditing: false,
                            },
                          }));
                        }
                      }}
                      className="custom-group-name-input"
                      autoFocus
                    />
                  ) : (
                    <h2
                      className="custom-group-name-heading"
                      onClick={(e) => {
                        e.stopPropagation();
                        setGroupNameEdits((prev) => ({
                          ...prev,
                          [force.id]: {
                            name: force.name,
                            isEditing: true,
                          },
                        }));
                      }}
                    >
                      {force.name}
                    </h2>
                  )
                ) : (
                  <h2>{force.name}</h2>
                )}
                {force.expanded ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </div>
              <div className="force-subheader">
                <div className="subtotal-budget">
                  Subtotal: {formatBudget(calculateSubtotal(force))}
                </div>
                {force.id.startsWith("custom_group") && (
                  <div className="group-actions">
                    <label>
                      Number of Items:
                      <input
                        type="number"
                        min={MIN_ITEMS_PER_GROUP}
                        max={MAX_ITEMS_PER_GROUP}
                        value={force.numItems}
                        onChange={(e) =>
                          handleNumItemsChange(
                            force.id,
                            parseInt(e.target.value) || MIN_ITEMS_PER_GROUP
                          )
                        }
                        className="num-items-input"
                      />
                    </label>
                    <button
                      className="delete-group-button"
                      onClick={() => deleteCustomGroup(force.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {force.expanded && (
              <div className="force-items">
                {Array.isArray(force.items)
                  ? force.items.slice(0, force.numItems).map((item, index) => (
                      <div key={index} className="item">
                        <div className="item-header">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              setForces((prevForces) =>
                                prevForces.map((f) => {
                                  if (f.id !== force.id) return f;
                                  const updatedItems = f.items.map((itm, idx) =>
                                    idx === index
                                      ? { ...itm, name: e.target.value }
                                      : itm
                                  );
                                  return { ...f, items: updatedItems };
                                })
                              );
                            }}
                            className="custom-name-input"
                          />
                          <span>{formatBudget(item.budget)}</span>
                        </div>
                        <input
                          type="range"
                          value={getScaledBudget(item.budget)}
                          min={getScaledBudget(item.min)}
                          max={getScaledBudget(item.max)}
                          step={getBudgetStep()}
                          onChange={(e) => {
                            const newBudgetScaled = new Decimal(e.target.value);
                            const newBudget = newBudgetScaled.mul(
                              SCALE_UNITS[scale]
                            );
                            updateBudget(force.id, index, newBudget);
                          }}
                        />
                        <div className="item-details">
                          <span>
                            Quantity:
                            <NumericFormat
                              value={item.quantity.toString()}
                              thousandSeparator={true}
                              onValueChange={(values) => {
                                const { value } = values;
                                handleQuantityChange(value, force.id, index);
                              }}
                              className="quantity-input"
                              displayType="input"
                              allowNegative={false}
                              decimalScale={0}
                              fixedDecimalScale={true}
                            />
                          </span>
                          <span>
                            Unit Cost:
                            <NumericFormat
                              value={item.unitCost.toString()}
                              thousandSeparator={true}
                              prefix="$"
                              decimalScale={2}
                              fixedDecimalScale={true}
                              onValueChange={(values) => {
                                const { value } = values;
                                handleUnitCostChange(value, force.id, index);
                              }}
                              className="unit-cost-input"
                              displayType="input"
                              allowNegative={false}
                            />
                          </span>
                        </div>
                      </div>
                    ))
                  : Object.entries(force.items).map(([name, item]) => (
                      <div key={name} className="item">
                        <div className="item-header">
                          <span>{name}</span>
                          <span>{formatBudget(item.budget)}</span>
                        </div>
                        <input
                          type="range"
                          value={getScaledBudget(item.budget)}
                          min={getScaledBudget(item.min)}
                          max={getScaledBudget(item.max)}
                          step={getBudgetStep()}
                          onChange={(e) => {
                            const newBudgetScaled = new Decimal(e.target.value);
                            const newBudget = newBudgetScaled.mul(
                              SCALE_UNITS[scale]
                            );
                            updateBudget(force.id, name, newBudget);
                          }}
                        />
                        <div className="item-details">
                          <span>
                            Quantity:
                            <NumericFormat
                              value={item.quantity.toString()}
                              thousandSeparator={true}
                              onValueChange={(values) => {
                                const { value } = values;
                                handleQuantityChange(value, force.id, name);
                              }}
                              className="quantity-input"
                              displayType="input"
                              allowNegative={false}
                              decimalScale={0}
                              fixedDecimalScale={true}
                            />
                          </span>
                          <span>
                            Unit Cost:
                            <NumericFormat
                              value={item.unitCost.toString()}
                              thousandSeparator={true}
                              prefix="$"
                              decimalScale={2}
                              fixedDecimalScale={true}
                              onValueChange={(values) => {
                                const { value } = values;
                                handleUnitCostChange(value, force.id, name);
                              }}
                              className="unit-cost-input"
                              displayType="input"
                              allowNegative={false}
                            />
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </div>
        ))}
        <div className="create-custom-group-wrapper">
          <button
            className="create-custom-group"
            onClick={() => {
              createNewCustomGroup();
            }}
            disabled={customGroupCount >= MAX_CUSTOM_GROUPS}
          >
            Create New Custom Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForceStructurePlanner;
