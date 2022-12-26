function decodeBase64(input: string): string {
  return Buffer.from(input, 'base64').toString('utf-8');
}

function trimAll(input: string): string {
  return input.replace(/\s/g, '');
}

export function decodeBase64TrimAll(input: string): string {
  const decoded = decodeBase64(input);
  const result = trimAll(decoded);
  return result;
}
