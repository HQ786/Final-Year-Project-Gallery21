// Encoding utility for user ID
export function encodeUserId(userId){
    return Buffer.from(userId)
      .toString('base64')
      .replace(/\+/g, '-')   // URL-safe alternatives
      .replace(/\//g, '_')
      .replace(/=+$/, '');   // Remove padding
  }
  
  