export interface ParsedUserAgent {
  device_type: string;
  browser: string;
  os: string;
}

export function parseUserAgent(ua: string): ParsedUserAgent {
  const result: ParsedUserAgent = {
    device_type: "desktop",
    browser: "Unknown",
    os: "Unknown",
  };

  if (!ua) return result;

  const uaLower = ua.toLowerCase();

  // Detect device type
  if (/mobile|android.*mobile|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    result.device_type = "mobile";
  } else if (/ipad|android(?!.*mobile)|tablet/i.test(ua)) {
    result.device_type = "tablet";
  }

  // Detect browser
  if (/edg\//i.test(ua)) {
    result.browser = "Edge";
  } else if (/opr\//i.test(ua) || /opera/i.test(ua)) {
    result.browser = "Opera";
  } else if (/chrome/i.test(ua) && !/edg/i.test(ua)) {
    result.browser = "Chrome";
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    result.browser = "Safari";
  } else if (/firefox/i.test(ua)) {
    result.browser = "Firefox";
  } else if (/msie|trident/i.test(ua)) {
    result.browser = "IE";
  }

  // Detect OS
  if (/windows nt/i.test(ua)) {
    result.os = "Windows";
  } else if (/mac os x/i.test(ua) && !/iphone|ipad/i.test(ua)) {
    result.os = "macOS";
  } else if (/iphone|ipad/i.test(ua)) {
    result.os = "iOS";
  } else if (/android/i.test(ua)) {
    result.os = "Android";
  } else if (/linux/i.test(ua)) {
    result.os = "Linux";
  } else if (/cros/i.test(ua)) {
    result.os = "Chrome OS";
  }

  return result;
}
