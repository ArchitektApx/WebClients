/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Drive verification issues
 */
export interface HttpsProtonMeDriveIntegrityBlockVerificationErrorsTotalV1SchemaJson {
  Labels: {
    shareType: "main" | "device" | "photo" | "shared";
    retryHelped: "yes" | "no";
    fileSize: "2**10" | "2**20" | "2**22" | "2**25" | "2**30" | "xxxxl";
  };
  Value: number;
}
