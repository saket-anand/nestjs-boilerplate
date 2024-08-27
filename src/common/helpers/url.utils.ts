export function removeQueryParameters(url: string): string {
  try {
    const urlObject = new URL(url);
    urlObject.search = ''; // Clears the query parameters
    return urlObject.href; // Returns the URL without query parameters
  } catch (error) {
    throw new Error('Invalid URL');
  }
}

export function getDomainFromUrl(url: string): string | null {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname; // Returns the domain (hostname) of the URL
  } catch (error) {
    console.error('Invalid URL:', error);
    return null; // Returns null in case of an invalid URL
  }
}

function getMainDomain(url: string): string | null {
  try {
    const urlObject = new URL(url);
    const hostname = urlObject.hostname;

    // Split the hostname into parts
    const parts = hostname.split('.');

    // Check if the URL has more than two parts (to detect subdomains)
    if (parts.length > 2) {
      // Return the last two parts of the hostname, assuming they represent the main domain
      return parts.slice(-2).join('.');
    } else {
      // If the URL doesn't have subdomains, return the hostname as is
      return hostname;
    }
  } catch (error) {
    console.error('Invalid URL:', error);
    return null; // Returns null in case of an invalid URL
  }
}
