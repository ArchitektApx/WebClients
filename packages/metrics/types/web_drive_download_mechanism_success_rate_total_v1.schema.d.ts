/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Measures unique successful or failed downloads and number of retries per particular download mechanisms we have in place on Web
 */
export interface HttpsProtonMeWebDriveDownloadMechanismSuccessRateTotalV1SchemaJson {
  Labels: {
    status: "success" | "failure";
    retry: "true" | "false";
    mechanism: "memory" | "sw" | "memory_fallback";
  };
  Value: number;
}
