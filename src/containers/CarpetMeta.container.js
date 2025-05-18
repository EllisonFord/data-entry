// src/containers/CarpetMeta.container.js

import 'server-only';
import productsMedia from '@/containers/productsMediaDict';

// Helper functions moved outside of classes
function pileCalculator(pileThickness) {
  switch (pileThickness.length) {
    case 1:
      return { pileThickness: pileThickness[0], pileTolerance: 1 };
    case 2:
      return {
        pileThickness: (pileThickness[0] + pileThickness[1]) / 2,
        pileTolerance: Math.abs((pileThickness[0] - pileThickness[1]) / 2)
      };
    case 3:
      return { pileThickness: pileThickness[0], pileTolerance: pileThickness[1] };
    default:
      return { pileThickness: undefined, pileTolerance: undefined };
  }
}


function mmToInches(milimeters) {
  return milimeters / 25.4;
}


function kgToPounds(kgs) {
  return 2.20462 * kgs;
}


/**
 * Converts centimeters to an imperial height string (feet'inches").
 * Handles rounding and the rollover from 12 inches to 1 foot.
 *
 * @param {number|string} cm - The length in centimeters.
 * @returns {string} The length formatted as feet'inches" (e.g., "5'11\"", "6'0\"", "0'8\""), or an error message for invalid input.
 */
function cmToImperialStr(cm) {
  // 1. Validate and parse input
  const numCm = parseFloat(cm);
  if (isNaN(numCm) || numCm < 0) {
    // Return an error or throw an exception for invalid input
    return "Invalid input";
    // Or: throw new Error("Input must be a non-negative number.");
  }

  // Handle zero case explicitly for clarity
  if (numCm === 0) {
    return "0'0\"";
  }

  // 2. Convert cm to total inches (1 inch = 2.54 cm)
  const totalInches = numCm / 2.54;

  // 3. Calculate feet and inches
  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(totalInches % 12); // Get the remainder inches and round

  // 4. Handle the 12-inch rollover
  if (inches === 12) {
    feet += 1;  // Add a foot
    inches = 0;   // Reset inches to zero
  }

  // 5. Format the output string
  let result = "";
  if (feet > 0) {
    result += `${feet}'`;
  }

  // Always include inches, even if 0, unless feet > 0 and inches is 0 (e.g. return 6' instead of 6'0")
  // OR always include inches for consistency like 6'0"
  // Let's go with always including inches for clarity like 6'0" or 0'5"
  // Update: A more common convention is X' or X'Y" or Y". Let's adjust.

  if (inches > 0) {
      result += `${inches}"`;
  } else if (feet === 0) {
      // If feet is 0 and inches rounded to 0 (e.g., for very small cm values)
      result = "0\"";
  }
  // If inches is 0 and feet > 0, result correctly remains just `${feet}'`

  // Ensure something is returned even if calculations result in 0 feet and 0 inches
  // (e.g., very small cm values might round to 0 inches)
  // The zero check at the start handles exact 0 cm.
  // The `else if (feet === 0)` block above handles small values rounding to 0".
  if (result === "") {
      // This case should theoretically only be hit if feet > 0 and inches = 0
      // which means the result is already set (e.g. "3'"). Let's refine logic.
      // Let's simplify the string construction based on final feet/inches.

      if (feet > 0) {
          result = `${feet}'`;
          if (inches > 0) {
              result += `${inches}"`; // Append inches if they exist
          }
          // else: if inches is 0, result is already correct (e.g., "3'")
      } else {
          // Only inches (feet is 0)
          result = `${inches}"`; // Handles 0'5" and also 0'0" (if not caught earlier)
      }
  }


  // Final refined string construction
  if (feet > 0) {
      result = `${feet}'`;
      if (inches > 0) {
          result += `${inches}"`;
      }
  } else {
       // If feet is 0, just show inches (e.g., 5")
       // Includes the case where input rounds to 0 inches.
       result = `${inches}"`;
  }


  return result;
}


class ProductABC {
  constructor(productID, internal, external, stock, tagPrice, titleTag = '', clearance) {
    this.productID = productID;
    this.internal = internal;
    this.external = external;
    this.stock = stock;
    this.clearance = clearance;

    // Initialize pricing structure as in your original code
    this.pricing = {
      original: {
        EUR: tagPrice.toString()
      },
      discount: {
        type: "percentage",
        value: 30
      },
      baseCurrency: "EUR"
    };

    this.titleTag = titleTag;
    this.media = productsMedia[productID];
    this.delivery = stock ? 0 : 1;
    this.mainImage = this.determineMainImage();
  }

  determineMainImage() {
    // crawl the obj and find the first that has A shot
    for (const key in productsMedia[this.productID]) {
      if (key.startsWith('A')) {
        return productsMedia[this.productID][key];
      }
    }
    return null; // Return null if no matching key is found
  }

  // Method to apply price calculations and convert to multiple currencies
  applyPricing(exchangeRates, targetCurrencies = ['USD', 'GBP']) {
    // Get original price from pricing structure
    const original = parseFloat(this.pricing.original.EUR);

    // Initialize current prices object if it doesn't exist
    if (!this.pricing.current) {
      this.pricing.current = {};
    }

    // Apply discount to calculate current price
    let current = original;
    if (this.pricing.discount.type === 'percentage') {
      current = original * (1 - (this.pricing.discount.value / 100));
    } else if (this.pricing.discount.type === 'absolute') {
      current = original - this.pricing.discount.value;
    }

    // Format with appropriate decimal places for EUR
    this.pricing.current.EUR = current.toFixed(2);

    // Calculate for other currencies
    targetCurrencies.forEach(currency => {
      if (currency === 'EUR') return;

      const rate = exchangeRates[currency];
      if (!rate) return;

      try {
        // Get decimal places for this currency
        let decimalPlaces = 2;
        try {
          const { currencies } = require('../utils/currencies.utils');
          decimalPlaces = currencies[currency]?.decimalPlaces ?? 2;
        } catch (e) {
          console.error('Currency not supported', e);
        }

        // Convert and round according to currency rules
        const originalInTarget = (original * rate).toFixed(decimalPlaces);
        const currentInTarget = (current * rate).toFixed(decimalPlaces);

        this.pricing.original[currency] = originalInTarget;
        this.pricing.current[currency] = currentInTarget;
      } catch (error) {
        console.error(`Error calculating price for ${currency}:`, error);
      }
    });

    return this;
  }
}

class TextileFloorCoveringABC extends ProductABC {
  constructor(productID, internal, external, stock, tagPrice, titleTag = '', weight, weavedMaterials, mainColors, highlightColors, origins, manufacturing, pileThickness, clearance) {
    super(productID, internal, external, stock, tagPrice, titleTag, clearance);
    this.weavedMaterials = weavedMaterials;
    this.mainColors = mainColors;
    this.highlightColors = highlightColors;
    this.fieldColors = [];
    this.borderColors = [];
    this.hasMedallion = false;
    this.origins = origins;
    this.manufacturing = manufacturing;

    this.colors = {};

    const { pileThickness: calculatedPileThickness, pileTolerance } = pileCalculator(pileThickness);

    this.measurements = {
      weight: {
        SI: {
          value: weight,
          unitType: 'kilogram'
        },
        USC: {
          value: parseFloat(kgToPounds(weight).toFixed(2)),
          unitType: 'pound'
        }
      },
      pile: {
        SI: {
          thickness: calculatedPileThickness,
          tolerance: pileTolerance,
          unitType: 'millimeter'
        },
        USC: {
          thickness: parseFloat(mmToInches(calculatedPileThickness).toFixed(2)),
          tolerance: parseFloat(mmToInches(pileTolerance).toFixed(2)),
          unitType: 'inch'
        }
      }
    }

  }
}

class RugABC extends TextileFloorCoveringABC {
  constructor(productID, internal, external, stock, tagPrice, titleTag='', weight, weavedMaterials, mainColors, highlightColors, origins, manufacturing, pileThickness, length, width, styles, usage, hasFringes, clearance, shape = 'rectangular') {
    super(productID, internal, external, stock, tagPrice, titleTag, weight, weavedMaterials, mainColors, highlightColors, origins, manufacturing, pileThickness, clearance);

    this.shape = shape;
    let dimensionsObj = {};
    let area = 0;

    switch(shape) {
      case 'round':
        // For round carpets, length parameter represents diameter
        dimensionsObj = {
          SI: {
            diameter: length,
            // Still store length and width for compatibility with existing code
            length: length,
            width: length,
            formatted: `Ø${length}`,
            unit: 'centimeter'
          },
          USC: {
            diameter: cmToImperialStr(length),
            length: cmToImperialStr(length),
            width: cmToImperialStr(length),
            formatted: `Ø${cmToImperialStr(length)}`,
            unit: 'foot'
          }
        };
        // Area of a circle: π * r²
        area = Math.PI * Math.pow(length / 2, 2);
        break;

      case 'oval':
        dimensionsObj = {
          SI: {
            majorAxis: length,
            minorAxis: width,
            length: length,
            width: width,
            formatted: `${length}x${width} (oval)`,
            unit: 'centimeter'
          },
          USC: {
            majorAxis: cmToImperialStr(length),
            minorAxis: cmToImperialStr(width),
            length: cmToImperialStr(length),
            width: cmToImperialStr(width),
            formatted: `${cmToImperialStr(length)} x ${cmToImperialStr(width)} (oval)`,
            unit: 'foot'
          }
        };
        // Approximate area of an ellipse: π * a * b
        area = Math.PI * (length / 2) * (width / 2);
        break;

      case 'freeform':
        dimensionsObj = {
          SI: {
            maxLength: length,
            maxWidth: width,
            length: length,
            width: width,
            formatted: `max ${length}x${width}`,
            unit: 'centimeter'
          },
          USC: {
            maxLength: cmToImperialStr(length),
            maxWidth: cmToImperialStr(width),
            length: cmToImperialStr(length),
            width: cmToImperialStr(width),
            formatted: `max ${cmToImperialStr(length)} x ${cmToImperialStr(width)}`,
            unit: 'foot'
          }
        };
        // For freeform, use max dimensions as approximation
        area = length * width;
        break;

      default: // rectangular
        dimensionsObj = {
          SI: {
            length: length,
            width: width,
            formatted: `${length}x${width}`,
            unit: 'centimeter'
          },
          USC: {
            length: cmToImperialStr(length),
            width: cmToImperialStr(width),
            formatted: `${cmToImperialStr(length)} x ${cmToImperialStr(width)}`,
            unit: 'foot'
          }
        };
        area = length * width;
    }

    // Create new measurements for this class
    const rugMeasurements = {
      dimensions: dimensionsObj,
      density: {
        SI: {
          value: area && weight ? Math.round((10**7 * weight) / area) : undefined,
          unitType: 'g/m²'
        },
        USC: {
          value: area && weight ? Math.round((weight * 294.9375) / area * 100) / 100 : undefined,
          unitType: 'oz/yd²'
        }
      }
    };

    // Merge the parent measurements with the rug-specific measurements
    this.measurements = {
      ...this.measurements,  // Spread the parent's measurements
      ...rugMeasurements     // Spread the rug-specific measurements
    };

    this.styles = styles;
    this.usage = usage;
    this.hasFringes = hasFringes;
    this.category = 'carpets';

    // Update properties to consider shape
    this.isRunner = shape === 'rectangular' && (length / width) > 2.01;
    this.isSquare = shape === 'rectangular' && (length / width) > 0.9 && (length / width) < 1.1;
    this.isRound = shape === 'round';
    this.isOval = shape === 'oval';
    this.isFreeform = shape === 'freeform';

    // COPIED RUN IN ROUTE this.title = this.generateTitle();
    // COPIED RUN IN ROUTE this.titleAtCheckout = `${this.title} ref ${this.productID}`;
    // COPIED RUN IN ROUTE this.titleAtURL = this.generateTitleAtURL();
    // COPIED RUN IN ROUTE this.basicAltTag = this.generateBasicAltTag();
  }
}

export class HandMadeRug extends RugABC {
  constructor(productID, internal, external, stock, tagPrice, titleTag, weight, weavedMaterials, mainColors, highlightColors, origins, pileThickness, length, width, styles, usage, features, region, storage, hasFringes=true, kpm=undefined, clearance=false, partner=null, foundationMaterial=1, shape='rectangular') {
    super(productID, internal, external, stock, tagPrice, titleTag, weight, weavedMaterials, mainColors, highlightColors, origins, 0, pileThickness, length, width, styles, usage, hasFringes, clearance, shape);
    this.region = region;
    this.kpm = kpm;
    this.partner = partner;
    this.features = features;
    this.foundationMaterial = foundationMaterial;
    this.subCategory = 'Handmade';
    this.storage = storage;
    // COPIED RUN IN ROUTE this.title = this.generateTitle();
    // COPIED RUN IN ROUTE this.altTag = this.generateAltTag();
  }
}
