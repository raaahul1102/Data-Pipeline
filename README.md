# Data Processing Pipeline

## Overview

This project implements a **data processing pipeline** in Node.js that
demonstrates working with: - Large JSON datasets (10,000+ records) -
Array methods (`map`, `filter`, `reduce`, `sort`) - String methods
(`split`, `trim`, `replace`, `toLowerCase`) - File I/O using **fs (sync
& async APIs)** - CLI flags for flexible execution modes

It was built as part of **Assignment 1: Data Processing Pipeline with
Array and String Manipulations**.

------------------------------------------------------------------------

## Project Structure

    data-pipeline/
    │── data/                # Holds input & output JSON files
    │   ├── data.json        # Raw dataset (generated)
    │   ├── cleaned.json     # Cleaned dataset (after processing)
    │
    │── src/
    │   ├── utils/
    │   │   ├── fileUtils.js   # Read/write utilities (sync & async support)
    │   │   ├── dataUtils.js   # Data cleaning & stats generation
    │   ├── generate.js        # Fake dataset generator
    │   ├── index.js           # CLI entry point
    │
    │── package.json
    │── README.md

------------------------------------------------------------------------

## Features

-   Generate fake dataset dynamically with Faker.js
-   Clean & normalize dataset:
    -   Split `fullName → firstName + lastName`
    -   Normalize emails (trim, lowercase)
    -   Remove invalid emails using regex
-   Generate statistics:
    -   Count email domains
    -   Count cities
-   Error handling for malformed/empty JSON
-   Benchmarking with `console.time`
-   **Chunk-based processing** to avoid memory overflow
-   **Sync/Async File I/O** using CLI flag `--async`

------------------------------------------------------------------------

## Installation

``` bash
git clone <repo-url>
cd Data-Pipeline
npm install
```

------------------------------------------------------------------------

## Usage

### 1. Generate Dataset

Default: **10,000 users**

``` bash
npm run generate
```

Custom size:

``` bash
npm run generate -- --n=5000
# or
node src/generate.js --n=20000
```

### 2. Clean Dataset

``` bash
node src/index.js clean
```

### 3. Generate Statistics

``` bash
node src/index.js stats
```

### 4. CLI Options

``` bash
node src/index.js <mode> [--async] [--chunk=2000] [--input=PATH] [--output=PATH]
```

**Modes:** - `clean` → Clean and normalize dataset - `stats` → Print
summary statistics - `--help` → Show usage guide

**Flags:** - `--async` → Switches to **asynchronous fs APIs**\
- Default is synchronous (blocking) I/O\
- Use async mode for **non-blocking large dataset processing** -
`--chunk=NUM` → Process data in chunks (default: 2000) - `--input=PATH`
→ Custom input JSON file - `--output=PATH` → Custom output JSON file

### Examples

``` bash
# Generate dataset of 10000 users
npm run generate

# Clean data synchronously (default)
node src/index.js clean

# Clean data asynchronously with 5000 record chunks
node src/index.js clean --async --chunk=5000

# Generate statistics
node src/index.js stats --async
```

------------------------------------------------------------------------

## Sample Output

    Email Domains: { gmail.com: 4500, yahoo.com: 3000, outlook.com: 2500 }
    Cities: { New York: 1200, London: 950, Berlin: 870 }
    Execution: 520.334ms

------------------------------------------------------------------------

## Highlights

-   Used **array & string methods** (`map`, `filter`, `reduce`, `sort`,
    `split`, `trim`, `toLowerCase`)
-   Implemented **custom loops** (`for`, `while`) for chunked processing
-   Demonstrated **sync & async file I/O**
-   Added **error handling** for edge cases
-   Optimized for **large datasets (10k+)**

-----------------------------------------------------------------------
