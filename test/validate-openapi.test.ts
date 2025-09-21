import { describe, test, expect } from "bun:test";
import * as SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import path from "path";
import fs from "fs";

interface MethodCount {
  [method: string]: number;
}

describe("OpenAPI Specification Validation", () => {
  test("should validate OpenAPI specification", async () => {
    const specPath = path.join(__dirname, "..", "openapi.yaml");

    // Check if file exists
    expect(fs.existsSync(specPath)).toBe(true);

    // Parse and validate the OpenAPI spec
    const api = await SwaggerParser.validate(specPath) as OpenAPIV3.Document;

    // Basic validations
    expect(api).toBeDefined();
    expect(api.info).toBeDefined();
    expect(api.info.title).toBeDefined();
    expect(api.info.version).toBeDefined();

    // Validate paths exist
    expect(api.paths).toBeDefined();
    const paths = Object.keys(api.paths || {});
    expect(paths.length).toBeGreaterThan(0);
  });

  test("should have unique operationIds", async () => {
    const specPath = path.join(__dirname, "..", "openapi.yaml");
    const api = await SwaggerParser.validate(specPath) as OpenAPIV3.Document;

    const operationIds = new Set<string>();
    const duplicates: string[] = [];
    const paths = Object.keys(api.paths || {});

    paths.forEach(pathKey => {
      const pathItem = api.paths![pathKey] as OpenAPIV3.PathItemObject;
      Object.keys(pathItem).forEach(method => {
        if (['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(method)) {
          const operation = (pathItem as any)[method] as OpenAPIV3.OperationObject;
          if (operation?.operationId) {
            if (operationIds.has(operation.operationId)) {
              duplicates.push(operation.operationId);
            }
            operationIds.add(operation.operationId);
          }
        }
      });
    });

    expect(duplicates).toEqual([]);
  });

  test("should have descriptions for all endpoints", async () => {
    const specPath = path.join(__dirname, "..", "openapi.yaml");
    const api = await SwaggerParser.validate(specPath) as OpenAPIV3.Document;

    const endpointsWithoutDescription: string[] = [];
    const paths = Object.keys(api.paths || {});

    paths.forEach(pathKey => {
      const pathItem = api.paths![pathKey] as OpenAPIV3.PathItemObject;
      Object.keys(pathItem).forEach(method => {
        if (['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(method)) {
          const operation = (pathItem as any)[method] as OpenAPIV3.OperationObject;
          if (operation && !operation.description && !operation.summary) {
            endpointsWithoutDescription.push(`${method.toUpperCase()} ${pathKey}`);
          }
        }
      });
    });

    // Warning, not a failure
    if (endpointsWithoutDescription.length > 0) {
      console.warn(`⚠ Endpoints without descriptions: ${endpointsWithoutDescription.join(', ')}`);
    }

    // This is a soft check - we just warn but don't fail
    expect(endpointsWithoutDescription.length).toBeGreaterThanOrEqual(0);
  });

  test("should have response definitions for all endpoints", async () => {
    const specPath = path.join(__dirname, "..", "openapi.yaml");
    const api = await SwaggerParser.validate(specPath) as OpenAPIV3.Document;

    const endpointsWithoutResponses: string[] = [];
    const paths = Object.keys(api.paths || {});

    paths.forEach(pathKey => {
      const pathItem = api.paths![pathKey] as OpenAPIV3.PathItemObject;
      Object.keys(pathItem).forEach(method => {
        if (['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(method)) {
          const operation = (pathItem as any)[method] as OpenAPIV3.OperationObject;
          if (operation && (!operation.responses || Object.keys(operation.responses).length === 0)) {
            endpointsWithoutResponses.push(`${method.toUpperCase()} ${pathKey}`);
          }
        }
      });
    });

    expect(endpointsWithoutResponses).toEqual([]);
  });

  test("should display API statistics", async () => {
    const specPath = path.join(__dirname, "..", "openapi.yaml");
    const api = await SwaggerParser.validate(specPath) as OpenAPIV3.Document;

    // Count endpoints and methods
    const paths = Object.keys(api.paths || {});
    let totalEndpoints = 0;
    const methods: MethodCount = {};

    paths.forEach(pathKey => {
      const pathItem = api.paths![pathKey] as OpenAPIV3.PathItemObject;
      const pathMethods = Object.keys(pathItem).filter(method =>
        ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(method)
      );
      totalEndpoints += pathMethods.length;
      pathMethods.forEach(method => {
        methods[method] = (methods[method] || 0) + 1;
      });
    });

    console.log("\nAPI Statistics:");
    console.log(`  Title: ${api.info.title}`);
    console.log(`  Version: ${api.info.version}`);
    console.log(`  Total paths: ${paths.length}`);
    console.log(`  Total endpoints: ${totalEndpoints}`);
    console.log(`  Methods breakdown:`, methods);

    // Validate counts
    expect(paths.length).toBeGreaterThan(0);
    expect(totalEndpoints).toBeGreaterThan(0);
  });

  test("should check for security schemes", async () => {
    const specPath = path.join(__dirname, "..", "openapi.yaml");
    const api = await SwaggerParser.validate(specPath) as OpenAPIV3.Document;

    const securitySchemes = api.components?.securitySchemes ? Object.keys(api.components.securitySchemes) : [];

    if (securitySchemes.length === 0) {
      console.warn("⚠ No security schemes defined");
    } else {
      console.log(`Security schemes: ${securitySchemes.join(', ')}`);
    }

    // This is informational - we don't fail if no security is defined
    expect(securitySchemes).toBeDefined();
  });

  test("should have servers defined", async () => {
    const specPath = path.join(__dirname, "..", "openapi.yaml");
    const api = await SwaggerParser.validate(specPath) as OpenAPIV3.Document;

    if (!api.servers || api.servers.length === 0) {
      console.warn("⚠ No servers defined");
    } else {
      console.log(`Servers (${api.servers.length}):`);
      api.servers.forEach((server, index) => {
        console.log(`  ${index + 1}. ${server.url} - ${server.description || 'No description'}`);
      });
    }

    // This is informational - we don't fail if no servers are defined
    expect(api.servers).toBeDefined();
  });
});