export function truncarComReticencias(texto: string, limite: number): string {
  // Verifica se a string excede o limite de caracteres
  if (texto.length > limite) {
    return texto.substring(0, limite) + '...';
  }
  return texto;
}
