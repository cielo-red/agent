const SwaggerParser = require("@apidevtools/swagger-parser");
const path = require("path");
const fs = require("fs");

async function validateOpenAPISpec() {
  const specPath = path.join(__dirname, "..", "openapi.yaml");

  console.log("OpenAPI Specification Validation");
  console.log("=================================");
  console.log(`Validating: ${specPath}\n`);

  try {
    // Check if file exists
    if (!fs.existsSync(specPath)) {
      throw new Error(`OpenAPI specification file not found at ${specPath}`);
    }

    // Parse and validate the OpenAPI spec
    const api = await SwaggerParser.validate(specPath);

    // Display basic info
    console.log("✓ Valid OpenAPI specification");
    console.log(`\nAPI Information:`);
    console.log(`  Title: ${api.info.title}`);
    console.log(`  Version: ${api.info.version}`);
    console.log(`  Description: ${api.info.description?.split('\n')[0]}...`);

    // Count and display endpoints
    const paths = Object.keys(api.paths);
    let totalEndpoints = 0;
    const methods = {};

    paths.forEach(path => {
      const pathMethods = Object.keys(api.paths[path]).filter(method =>
        ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(method)
      );
      totalEndpoints += pathMethods.length;
      pathMethods.forEach(method => {
        methods[method] = (methods[method] || 0) + 1;
      });
    });

    console.log(`\nEndpoint Statistics:`);
    console.log(`  Total paths: ${paths.length}`);
    console.log(`  Total endpoints: ${totalEndpoints}`);
    console.log(`  Methods breakdown:`);
    Object.entries(methods).forEach(([method, count]) => {
      console.log(`    ${method.toUpperCase()}: ${count}`);
    });

    // Validate schemas
    const schemas = api.components?.schemas ? Object.keys(api.components.schemas) : [];
    console.log(`\nSchemas: ${schemas.length} defined`);
    if (schemas.length > 0) {
      console.log(`  Schemas: ${schemas.slice(0, 5).join(', ')}${schemas.length > 5 ? ', ...' : ''}`);
    }

    // Check security schemes
    const securitySchemes = api.components?.securitySchemes ? Object.keys(api.components.securitySchemes) : [];
    console.log(`\nSecurity:`);
    if (securitySchemes.length > 0) {
      console.log(`  Security schemes: ${securitySchemes.join(', ')}`);
    } else {
      console.log(`  ⚠ No security schemes defined`);
    }

    // Check for servers
    if (api.servers && api.servers.length > 0) {
      console.log(`\nServers: ${api.servers.length} defined`);
      api.servers.forEach((server, index) => {
        console.log(`  ${index + 1}. ${server.url} - ${server.description || 'No description'}`);
      });
    } else {
      console.log(`\n⚠ No servers defined`);
    }

    // Additional validations
    console.log(`\nAdditional Checks:`);

    // Check for operationId uniqueness
    const operationIds = new Set();
    let duplicateOperationIds = false;

    paths.forEach(pathKey => {
      const pathItem = api.paths[pathKey];
      Object.keys(pathItem).forEach(method => {
        if (['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(method)) {
          const operation = pathItem[method];
          if (operation.operationId) {
            if (operationIds.has(operation.operationId)) {
              duplicateOperationIds = true;
              console.log(`  ✗ Duplicate operationId found: ${operation.operationId}`);
            }
            operationIds.add(operation.operationId);
          }
        }
      });
    });

    if (!duplicateOperationIds) {
      console.log(`  ✓ All operationIds are unique`);
    }

    // Check for missing descriptions
    let missingDescriptions = 0;
    paths.forEach(pathKey => {
      const pathItem = api.paths[pathKey];
      Object.keys(pathItem).forEach(method => {
        if (['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(method)) {
          const operation = pathItem[method];
          if (!operation.description && !operation.summary) {
            missingDescriptions++;
          }
        }
      });
    });

    if (missingDescriptions === 0) {
      console.log(`  ✓ All endpoints have descriptions or summaries`);
    } else {
      console.log(`  ⚠ ${missingDescriptions} endpoint(s) missing descriptions`);
    }

    // Check for response definitions
    let missingResponses = 0;
    paths.forEach(pathKey => {
      const pathItem = api.paths[pathKey];
      Object.keys(pathItem).forEach(method => {
        if (['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(method)) {
          const operation = pathItem[method];
          if (!operation.responses || Object.keys(operation.responses).length === 0) {
            missingResponses++;
          }
        }
      });
    });

    if (missingResponses === 0) {
      console.log(`  ✓ All endpoints have response definitions`);
    } else {
      console.log(`  ✗ ${missingResponses} endpoint(s) missing response definitions`);
    }

    console.log("\n✅ OpenAPI specification validation completed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Validation failed:");
    console.error(`  ${error.message}`);

    if (error.details) {
      console.error("\nDetailed errors:");
      error.details.forEach(detail => {
        console.error(`  - ${detail}`);
      });
    }

    process.exit(1);
  }
}

// Run validation
validateOpenAPISpec();