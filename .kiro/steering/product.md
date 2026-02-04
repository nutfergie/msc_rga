# Product Overview

## RGA Web Application

A Return Goods Authorization (RGA) system for managing product cancellations and returns. The application is a frontend-only Single Page Application (SPA) that integrates with a backend API.

## Core Functionality

- **Order Search**: Search for orders by year and order number
- **Reason Selection**: Select main and sub-reasons for product cancellation
- **Partial Cancellation**: Cancel specific items or quantities within an order
- **RGA Document Generation**: Create RGA documents with unique reference numbers (format: YYNNNNNNNN)

## User Flow

1. User searches for an order using year and order number
2. System displays order details with line items
3. User selects cancellation reasons (main + sub-reason)
4. User specifies quantities to cancel for each line item
5. System generates RGA document with reference number

## Language

The application is designed for Thai users - all UI text, error messages, and documentation are in Thai language.
