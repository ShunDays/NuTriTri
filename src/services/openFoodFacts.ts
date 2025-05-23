interface OpenFoodFactsProduct {
  code: string;
  product: {
    product_name: string;
    nutriments: {
      energy: number;
      proteins: number;
      carbohydrates: number;
      fat: number;
    };
    quantity: string;
  };
}

export async function searchFood(query: string): Promise<OpenFoodFactsProduct[]> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&search_simple=1&action=process&json=1`
    );
    const data = await response.json();
    return data.products.map((product: any) => ({
      code: product.code,
      product: {
        product_name: product.product_name,
        nutriments: {
          energy: product.nutriments.energy || 0,
          proteins: product.nutriments.proteins || 0,
          carbohydrates: product.nutriments.carbohydrates || 0,
          fat: product.nutriments.fat || 0,
        },
        quantity: product.quantity || "100g",
      },
    }));
  } catch (error) {
    console.error("Erreur lors de la recherche d'aliments:", error);
    return [];
  }
}

export async function getFoodDetails(code: string): Promise<OpenFoodFactsProduct | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${code}.json`
    );
    const data = await response.json();
    if (data.status === 1) {
      return {
        code: data.product.code,
        product: {
          product_name: data.product.product_name,
          nutriments: {
            energy: data.product.nutriments.energy || 0,
            proteins: data.product.nutriments.proteins || 0,
            carbohydrates: data.product.nutriments.carbohydrates || 0,
            fat: data.product.nutriments.fat || 0,
          },
          quantity: data.product.quantity || "100g",
        },
      };
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails:", error);
    return null;
  }
} 