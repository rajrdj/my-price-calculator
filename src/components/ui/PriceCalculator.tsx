"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Utility function for calculation
const calculateCosts = (inputs) => {
  const adjustedPerPiecePrice =
    (inputs.basePrice * inputs.totalQuantity) / inputs.receivedQuantity;
  const transportPerPiece = inputs.transportCost / inputs.receivedQuantity;
  const gstAmount = adjustedPerPiecePrice * (inputs.gstRate / 100);
  const returnCost = (inputs.returnShippingFee * inputs.returnRate) / 100;
  const damageCost = (inputs.returnShippingFee * inputs.damageRate) / 100;

  const totalCost =
    adjustedPerPiecePrice +
    transportPerPiece +
    gstAmount +
    returnCost +
    damageCost +
    inputs.ratingCardCost +
    inputs.packagingCost +
    inputs.margin;

  return {
    adjustedPerPiecePrice,
    transportPerPiece,
    gstAmount,
    returnCost,
    damageCost,
    totalCost,
  };
};

// Input Field Component
const InputField = memo(({ label, name, value, onChange }) => {
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleBlur = () => {
    onChange(name, parseFloat(tempValue) || 0);
  };

  const handleChange = (e) => {
    setTempValue(e.target.value);
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        type="number"
        id={name}
        name={name}
        value={tempValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="h-9 px-3 py-1 text-sm rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        step="any"
        min="0"
        inputMode="decimal"
        onWheel={(e) => e.target.blur()} // Prevent scroll input
      />
    </div>
  );
});

// Result Row Component
const ResultRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-medium">₹{value.toFixed(2)}</span>
  </div>
);

const PriceCalculator = () => {
  const [inputs, setInputs] = useState({
    basePrice: 100,
    totalQuantity: 100,
    receivedQuantity: 96,
    transportCost: 560,
    gstRate: 3.5,
    returnShippingFee: 160,
    returnRate: 5,
    damageRate: 2,
    ratingCardCost: 1,
    packagingCost: 15,
    margin: 50,
  });

  const [calculations, setCalculations] = useState(() =>
    calculateCosts(inputs)
  );

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    setCalculations(calculateCosts(inputs));
  }, [inputs]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Product Price Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-4">
              <InputField
                label="Base Price (₹)"
                name="basePrice"
                value={inputs.basePrice}
                onChange={handleInputChange}
              />
              <InputField
                label="Total Quantity"
                name="totalQuantity"
                value={inputs.totalQuantity}
                onChange={handleInputChange}
              />
              <InputField
                label="Received Quantity"
                name="receivedQuantity"
                value={inputs.receivedQuantity}
                onChange={handleInputChange}
              />
              <InputField
                label="Transport Cost (₹)"
                name="transportCost"
                value={inputs.transportCost}
                onChange={handleInputChange}
              />
              <InputField
                label="GST Rate (%)"
                name="gstRate"
                value={inputs.gstRate}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-4">
              <InputField
                label="Return Shipping Fee (₹)"
                name="returnShippingFee"
                value={inputs.returnShippingFee}
                onChange={handleInputChange}
              />
              <InputField
                label="Return Rate (%)"
                name="returnRate"
                value={inputs.returnRate}
                onChange={handleInputChange}
              />
              <InputField
                label="Damage Rate (%)"
                name="damageRate"
                value={inputs.damageRate}
                onChange={handleInputChange}
              />
              <InputField
                label="Rating Card Cost (₹)"
                name="ratingCardCost"
                value={inputs.ratingCardCost}
                onChange={handleInputChange}
              />
              <InputField
                label="Packaging Cost (₹)"
                name="packagingCost"
                value={inputs.packagingCost}
                onChange={handleInputChange}
              />
              <InputField
                label="Margin (₹)"
                name="margin"
                value={inputs.margin}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <Separator className="my-8" />

          <Card className="bg-gray-50/50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <ResultRow
                  label="Adjusted Per Piece Price"
                  value={calculations.adjustedPerPiecePrice}
                />
                <ResultRow
                  label="Transport Cost Per Piece"
                  value={calculations.transportPerPiece}
                />
                <ResultRow label="GST Amount" value={calculations.gstAmount} />
                <ResultRow label="Return Cost" value={calculations.returnCost} />
                <ResultRow label="Damage Cost" value={calculations.damageCost} />
                <ResultRow
                  label="Rating Card Cost"
                  value={inputs.ratingCardCost}
                />
                <ResultRow
                  label="Packaging Cost"
                  value={inputs.packagingCost}
                />
                <ResultRow label="Margin" value={inputs.margin} />
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center py-3 px-4 bg-primary/5 rounded-lg">
                <span className="text-lg font-semibold">Final Price</span>
                <span className="text-lg font-bold text-green-600">
                  ₹{calculations.totalCost.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceCalculator;
