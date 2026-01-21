# Mid-Level Javascript Engineer - Take Home Exam

## Objective

Build a command-line application that processes sales data from a file, handles currency conversion and tax application, and outputs a summary report.

## The Scenario

You are building a backend service for a merchant who sells items globally. They have sales records in mixed formats (CSV and JSON) and multiple currencies. They need a tool to:

1.  **Read** sales data from a file.
2.  **Normalize** the currency to a base currency (USD).
3.  **Apply** a tax rule based on the item type.
4.  **Report** the total revenue and total tax collected.

## Requirements

### 1. Input Parsing
The application should accept a file path as an argument. It must support both `.csv` and `.json` files.

**CSV Format:**
```csv
date,sku,price,currency,type
2024-01-15,T-SHIRT-001,20.00,USD,clothing
2024-01-16,MUG-002,15.00,EUR,merchandise
```

**JSON Format:**
```json
[
  {
    "date": "2024-01-15",
    "sku": "T-SHIRT-001",
    "price": 20.00,
    "currency": "USD",
    "type": "clothing"
  }
]
```

### 2. Currency Conversion
Convert all prices to **USD**.
For this exercise, use the following **hardcoded** exchange rates:

- `EUR` -> `USD`: 1.10
- `CAD` -> `USD`: 0.75
- `USD`: 1.00

*Note: In a real app, you'd call an API, but for this exercise, hardcoded map is fine.*

### 3. Tax Rules
Apply tax based on the item `type`:
- `clothing`: 5% tax
- `merchandise`: 15% tax
- `digital`: 0% tax (tax-exempt)
- *Default*: 10% tax for any other type

### 4. Output
Display the results in a user-friendly table using `cli-table3` and `chalk`.

**Example Output (approximate):**
```text
┌──────────────────────────────────────────────────┐
│                   Sales Summary                  │
├───────────────┬────────────┬─────────────────────┤
│ Total Items   │ 5          │                     │
├───────────────┼────────────┼─────────────────────┤
│ Total Revenue │ $150.25    │ (USD)               │
├───────────────┼────────────┼─────────────────────┤
│ Total Tax     │ $12.50     │ (USD)               │
└───────────────┴────────────┴─────────────────────┘
```

(The headers should be styled, e.g., bold or colored).


## Getting Started

1.  **Install dependencies**: `npm install`
2.  **Run the app**: `npm start -- path/to/file.csv`
3.  **Run the tests**: `npm test`

## Starter Code
We have provided a basic skeleton structure:
- `src/index.js`: Entry point.
- `src/parser.js`: For file parsing logic.
- `src/processor.js`: For business logic.
- `data/`: Sample data files.

## Evaluation Criteria
We are looking for:
- **Clean Code**: Readable, well-structured, and easy to follow.
- **Modularity**: Separation of concerns (parsing vs logic vs output).
- **Error Handling**: What happens if the file doesn't exist? Or the format is wrong?
- **Testing**: We've included `jest`. Please add unit tests for your core logic.

Good luck!
