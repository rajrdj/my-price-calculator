"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle } from "lucide-react";

interface Product {
  id: number;
  name: string;
  basePrice: number;
  quantity: number;
  returnRate: number;
  damageRate: number;
  margin: number;
  packagingCost: number;
  individualCalculations?: ProductCalculations;
}

interface ProductCalculations {
  averagePrice: number;
  transportCost: number;
  gstAmount: number;
  returnCost: number;
  damageCost: number;
  totalProductCost: number;
}

interface CommonParameters {
  receivedQuantity: number;
  transportCost: number;
  gstRate: number;
  returnShippingFee: number;
  ratingCardCost: number;
}

const PriceCalculator = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Product 1",
      basePrice: 40,
      quantity: 319,
      returnRate: 5,
      damageRate: 2,
      margin: 25,
      packagingCost: 10,
    },
    {
      id: 2,
      name: "Product 2",
      basePrice: 35,
      quantity: 240,
      returnRate: 3,
      damageRate: 1.5,
      margin: 20,
      packagingCost: 8,
    },
  ]);

  const [commonParameters, setCommonParameters] = useState<CommonParameters>({
    receivedQuantity: 559,
    transportCost: 1200,
    gstRate: 3.5,
    returnShippingFee: 160,
    ratingCardCost: 1,
  });

  const [summaryCalculations, setSummaryCalculations] = useState({
    totalBasePrice: 0,
    totalQuantity: 0,
    overallAveragePrice: 0,
    totalProductCost: 0,
  });

  const calculateProductCosts = (product: Product): ProductCalculations => {
    const { basePrice, quantity, returnRate, damageRate, margin, packagingCost } =
      product;
    const { transportCost, receivedQuantity, gstRate, returnShippingFee } =
      commonParameters;

    const proportionalTransportCost =
      transportCost * (quantity / receivedQuantity);
    const transportCostPerPiece = proportionalTransportCost / quantity;

    const averagePrice = basePrice;
    const gstAmount = averagePrice * (gstRate / 100);
    const returnCost = (returnShippingFee * returnRate) / 100;
    const damageCost = (returnShippingFee * damageRate) / 100;

    const totalProductCost =
      averagePrice +
      transportCostPerPiece +
      gstAmount +
      returnCost +
      damageCost +
      commonParameters.ratingCardCost +
      packagingCost +
      margin;

    return {
      averagePrice,
      transportCost: transportCostPerPiece,
      gstAmount,
      returnCost,
      damageCost,
      totalProductCost,
    };
  };

  const updateSummaryCalculations = (currentProducts: Product[]) => {
    const totalBasePrice = currentProducts.reduce(
      (sum, p) => sum + p.basePrice * p.quantity,
      0
    );
    const totalQuantity = currentProducts.reduce((sum, p) => sum + p.quantity, 0);
    const overallAveragePrice =
      totalQuantity > 0 ? totalBasePrice / totalQuantity : 0;
    const totalProductCost = currentProducts.reduce(
      (sum, p) =>
        sum + (p.individualCalculations?.totalProductCost || 0) * p.quantity,
      0
    );

    setSummaryCalculations({
      totalBasePrice,
      totalQuantity,
      overallAveragePrice,
      totalProductCost,
    });
  };

  const updateProduct = (id: number, field: keyof Product, value: any) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      );

      const recalculatedProducts = updatedProducts.map((product) => ({
        ...product,
        individualCalculations: calculateProductCosts(product),
      }));

      updateSummaryCalculations(recalculatedProducts);

      return recalculatedProducts;
    });
  };

  const updateCommonParameter = (field: keyof CommonParameters, value: number) => {
    setCommonParameters((prev) => {
      const updatedParameters = { ...prev, [field]: value };

      const recalculatedProducts = products.map((product) => ({
        ...product,
        individualCalculations: calculateProductCosts(product),
      }));

      setProducts(recalculatedProducts);
      updateSummaryCalculations(recalculatedProducts);

      return updatedParameters;
    });
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now(),
      name: `Product ${products.length + 1}`,
      basePrice: 0,
      quantity: 0,
      returnRate: 5,
      damageRate: 2,
      margin: 25,
      packagingCost: 10,
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (id: number) => {
    setProducts((prevProducts) => {
      const filteredProducts = prevProducts.filter((p) => p.id !== id);
      updateSummaryCalculations(filteredProducts);
      return filteredProducts;
    });
  };

  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Flexible Multi-Product Price Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.map((product) => (
            <Card key={product.id} className="mb-4 p-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Product Name</Label>
                  <Input
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label>Base Price (₹)</Label>
                  <Input 
                    type="number" 
                    value={product.basePrice}
                    onChange={(e) => updateProduct(product.id, 'basePrice', parseFloat(e.target.value) || 0)}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input 
                    type="number" 
                    value={product.quantity}
                    onChange={(e) => updateProduct(product.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="h-9"
                  />
                </div>
                {products.length > 1 && (
                  <div className="flex items-end">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => removeProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div>
                  <Label>Return Rate (%)</Label>
                  <Input 
                    type="number" 
                    value={product.returnRate}
                    onChange={(e) => updateProduct(product.id, 'returnRate', parseFloat(e.target.value) || 0)}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label>Damage Rate (%)</Label>
                  <Input 
                    type="number" 
                    value={product.damageRate}
                    onChange={(e) => updateProduct(product.id, 'damageRate', parseFloat(e.target.value) || 0)}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label>Margin (₹)</Label>
                  <Input 
                    type="number" 
                    value={product.margin}
                    onChange={(e) => updateProduct(product.id, 'margin', parseFloat(e.target.value) || 0)}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label>Packaging Cost (₹)</Label>
                  <Input 
                    type="number" 
                    value={product.packagingCost}
                    onChange={(e) => updateProduct(product.id, 'packagingCost', parseFloat(e.target.value) || 0)}
                    className="h-9"
                  />
                </div>
              </div>
              {product.individualCalculations && (
                <Card className="mt-4 bg-gray-50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-sm text-gray-600">Total Product Cost</p>
                        <p className="font-bold">
                          ₹{product.individualCalculations.totalProductCost.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Return Cost</p>
                        <p>₹{product.individualCalculations.returnCost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Damage Cost</p>
                        <p>₹{product.individualCalculations.damageCost.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </Card>
          ))}

          <div className="flex justify-between items-center mb-4">
            <Button onClick={addProduct} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>

          {/* Common Parameters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Common Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(commonParameters).map((key) => (
                  <div key={key}>
                    <Label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                    <Input
                      type="number"
                      value={commonParameters[key as keyof CommonParameters]}
                      onChange={(e) => updateCommonParameter(
                        key as keyof CommonParameters, 
                        parseFloat(e.target.value) || 0
                      )}
                      className="h-9"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Summary */}
          <Card className="bg-blue-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Base Price</p>
                  <p className="text-xl font-bold">
                    ₹{summaryCalculations.totalBasePrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Quantity</p>
                  <p className="text-xl font-bold">
                    {summaryCalculations.totalQuantity}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overall Average Price</p>
                  <p className="text-xl font-bold">
                    ₹{summaryCalculations.overallAveragePrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Product Cost</p>
                  <p className="text-xl font-bold text-green-600">
                    ₹{summaryCalculations.totalProductCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};


export default PriceCalculator;
