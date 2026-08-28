/**
 * Standard API error response shape returned by the global exception filter.
 * All error responses from the ALMS backend conform to this interface.
 */
export interface ApiError {
  /** HTTP status code */
  statusCode: number;

  /** Machine-readable error code (e.g. "VALIDATION_ERROR", "UNAUTHORIZED") */
  error: string;

  /** Human-readable summary message */
  message: string;

  /**
   * Per-field validation details, present only for 400/422 responses.
   * Each entry is keyed by field name and contains one or more constraint messages.
   */
  details?: Record<string, string[]>;

  /** ISO 8601 timestamp of when the error occurred */
  timestamp: string;

  /** Request path that produced the error */
  path: string;
}
