# Property-Based Test Setup Instructions

## What was done

Property-based tests have been added to `src/lib/utils/__tests__/typeConverter.test.ts` for:

1. **Property 3**: Request data transformation (camelCase to snake_case)
2. **Property 4**: Response data transformation (snake_case to camelCase)  
3. **Property 12**: ISO date string conversion

## Installation Required

The `fast-check` library has been added to `package.json` but needs to be installed:

```bash
cd frontend
npm install
```

## Running the Tests

After installation, run the property-based tests:

```bash
cd frontend
npm test -- typeConverter
```

Or use the provided batch file (Windows):

```bash
cd frontend
install-and-test.bat
```

## What the Tests Validate

### Property 3: Request data transformation
- Converts all camelCase keys to snake_case for any object
- Handles nested objects recursively
- Preserves all values while converting keys
- Runs 100 iterations with random data

### Property 4: Response data transformation
- Converts all snake_case keys to camelCase for any object
- Handles nested objects recursively
- Preserves all values while converting keys
- Verifies round-trip conversion (snake → camel → snake)
- Runs 100 iterations with random data

### Property 12: ISO date string conversion
- Parses any valid ISO date string to Date object
- Handles date-only ISO strings (YYYY-MM-DD)
- Returns null for invalid date strings
- Verifies round-trip conversion (Date → ISO → Date)
- Handles dates across different timezones consistently
- Formats any Date to valid ISO date string
- Runs 100 iterations with random data

## Expected Results

All property-based tests should pass, validating that:
- Type conversions work correctly for any input
- No edge cases are missed
- Round-trip conversions preserve data integrity
