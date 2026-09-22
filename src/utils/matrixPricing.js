/** Cari indeks tingkatan (tier) yang cocok untuk qty tertentu — portir dari findTierIndexForQty() versi HTML. */
export function findTierIndexForQty(tiers, qty) {
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    if (qty >= t.min && (t.max == null || qty <= t.max)) return i;
  }
  return tiers.length ? tiers.length - 1 : -1;
}

/** Cari harga dari Matriks Harga sesuai bahan + qty (nentuin tier otomatis) + sisi ('satu'|'dua'). */
export function lookupMatrixPrice(hargaMatrix, bahanNama, qty, sisi) {
  if (!hargaMatrix) return 0;
  const bahanItem = hargaMatrix.bahan.find(b => b.nama === bahanNama);
  if (!bahanItem) return 0;
  const tierIdx = findTierIndexForQty(hargaMatrix.tiers, qty);
  if (tierIdx < 0) return 0;
  const h = bahanItem.harga[tierIdx];
  return h ? (h[sisi] || 0) : 0;
}
