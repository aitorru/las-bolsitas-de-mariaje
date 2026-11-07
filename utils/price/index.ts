/** Prices are free text in Firestore ("12", "4 - 11", "26€ Mochila + 7€ Estuche"). */
export function formatPrice(precio: string): string {
  const value = precio.trim();
  return value.includes("€") ? value : `${value} €`;
}
