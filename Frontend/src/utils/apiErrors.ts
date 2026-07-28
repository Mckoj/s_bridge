/**
 * HTTP error classification for the SBridge frontend.
 * Keeps all error-code logic in one place so services and
 * hooks never need to re-implement it.
 */

export type ApiErrorCode =
  | "UNAUTHORIZED"       // 401 — session expired
  | "FORBIDDEN"          // 403 — no permission
  | "NOT_FOUND"          // 404 — endpoint / resource does not exist
  | "NOT_IMPLEMENTED"    // 501 — server knows but not implemented
  | "SERVER_ERROR"       // 500+ — backend failure
  | "NETWORK_ERROR"      // no response received
  | "UNKNOWN";           // anything else

export interface ClassifiedApiError {
  code: ApiErrorCode;
  status?: number;
  message: string;
  /** True when the endpoint simply hasn't been deployed yet (404/501) */
  isEndpointUnavailable: boolean;
}

/**
 * Classifies an Axios error into a structured ClassifiedApiError.
 *
 * Usage:
 *   } catch (err: any) {
 *     const classified = classifyApiError(err);
 *     if (classified.isEndpointUnavailable) return [];  // feature not deployed
 *     throw classified;
 *   }
 */
export function classifyApiError(err: unknown): ClassifiedApiError {
  if (!err || typeof err !== "object") {
    return {
      code: "UNKNOWN",
      message: "An unexpected error occurred.",
      isEndpointUnavailable: false,
    };
  }

  const e = err as any;
  const status: number | undefined = e?.response?.status;

  if (!status) {
    // No response — network timeout or connection refused
    return {
      code: "NETWORK_ERROR",
      message: "Unable to connect to the server. Check your internet connection and try again.",
      isEndpointUnavailable: false,
    };
  }

  switch (status) {
    case 401:
      return {
        code: "UNAUTHORIZED",
        status,
        message: "Your session has expired. Please sign in again.",
        isEndpointUnavailable: false,
      };
    case 403:
      return {
        code: "FORBIDDEN",
        status,
        message: "You do not have permission to view this resource.",
        isEndpointUnavailable: false,
      };
    case 404:
      return {
        code: "NOT_FOUND",
        status,
        message: "This feature is not yet available. Check back in a future update.",
        isEndpointUnavailable: true,
      };
    case 501:
      return {
        code: "NOT_IMPLEMENTED",
        status,
        message: "This feature has not been implemented on the server yet.",
        isEndpointUnavailable: true,
      };
    default:
      if (status >= 500) {
        return {
          code: "SERVER_ERROR",
          status,
          message: "The server encountered an error. Please try again shortly.",
          isEndpointUnavailable: false,
        };
      }
      return {
        code: "UNKNOWN",
        status,
        message: e?.response?.data?.error || "An unexpected error occurred.",
        isEndpointUnavailable: false,
      };
  }
}

/**
 * Human-readable label for each code — used by ErrorState component.
 */
export function getErrorTitle(code: ApiErrorCode): string {
  switch (code) {
    case "UNAUTHORIZED":  return "Session Expired";
    case "FORBIDDEN":     return "Access Denied";
    case "NOT_FOUND":     return "Feature Unavailable";
    case "NOT_IMPLEMENTED": return "Coming Soon";
    case "SERVER_ERROR":  return "Server Error";
    case "NETWORK_ERROR": return "Connection Failed";
    default:              return "Something Went Wrong";
  }
}
