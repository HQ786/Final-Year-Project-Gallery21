export function decodeUserId(encodedUserId) {
    try {
      const base64 = encodedUserId
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        + '=='.slice(0, (4 - encodedUserId.length % 4) % 4);
      
      return Buffer.from(base64, 'base64').toString('utf-8');
    } catch (error) {
      console.error('User ID decoding failed', error);
      return '';
    }
  }