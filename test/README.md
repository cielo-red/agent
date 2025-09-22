# OpenAPI Specification Tests

This directory contains validation tests for the OpenAPI specification.

## Setup

Install dependencies:
```bash
npm install
```

## Running Tests

Run the OpenAPI validation:
```bash
npm test
```

Or directly:
```bash
node test/validate-openapi.js
```

## What the Tests Validate

The validation script checks:

1. **Syntax Validation**: Ensures the OpenAPI specification is valid YAML/JSON
2. **Schema Compliance**: Validates against OpenAPI 3.0.3 schema
3. **Reference Resolution**: Ensures all $ref references are valid
4. **Structure Validation**:
   - Verifies required fields are present
   - Checks data types match schema definitions
   - Validates enum values

5. **Additional Checks**:
   - Unique operationIds across all endpoints
   - All endpoints have descriptions or summaries
   - All endpoints have response definitions
   - Security schemes are properly defined
   - Server configurations are present

## GitHub Actions Integration

The workflow file `openapi-validation.yml` needs to be moved to `.github/workflows/` to enable automatic validation on:
- Push events affecting the OpenAPI spec
- Pull requests modifying the spec
- Manual workflow dispatch

To enable the GitHub Action:
```bash
mv openapi-validation.yml .github/workflows/
```

## Output

The test provides:
- ✅ Success indicators for valid specifications
- ❌ Clear error messages for validation failures
- Statistics about endpoints, methods, and schemas
- Warnings for potential issues (missing descriptions, security, etc.)