# Declutter Types

An Umbraco backoffice dashboard that helps you find unused document and data types across your site. Includes block list and block grid component detection.

## Features
- Searches through your content tree to find document types that aren't used by any content nodes
- Finds inner content nodes that reference a specific document type (e.g. for nested content or block list components)
- Save your progress and come back to it later with the "Save in Tool" feature
- Works with both SQL Server and SQLite

## Compatibility

| Umbraco | .NET | Supported |
|---------|------|-----------|
| v13–v14 | net8 | ✓ |
| v15–v16 | net9 | ✓ |
| v17     | net10 | ✓ |

## Installation
- Install via NuGet https://www.nuget.org/packages/DigitalWonderlab.DeclutterTypes/latest
- Go to Content and click the Declutter Types tab


## Usage

Once installed, navigate to the **Content** section in the Umbraco backoffice. A **Declutter Types** dashboard tab will appear.

1. Click **Run** to scan your content, media and members
2. Review the results — unused document types and data types are listed by category
3. Enable **Save in Tool** to persist the results between visits
4. Click **Open in Umbraco** on any item to navigate directly to it, verify its usage, and delete if desired

## Notes

- On Umbraco 15 and later, the tool scans all content, including unpublished content and unpublished changes. Types used only there are listed separately under **Used Only in Unpublished Content**, as deleting them would delete or break that content. On Umbraco 13 it scans **published** content only
- Blocks are found wherever they are stored: Block List (including single block mode), Block Grid, blocks in a rich text editor, nested blocks and Nested Content
- List views chosen as a document or media type's collection view count as in use
- Each result says why it is listed: whether a data type has no properties or only empty ones, and what still links to a document type (compositions, allowed child types, block editors that offer it)
- Some types may appear unused but still be referenced in code (views, controllers, models) or settings — always verify before deleting
- Third Party Data Types are listed separately as their usage cannot always be determined from property values alone

## Issues / Suggestions
- To report an issue or suggest a feature please use the GitHub issue tracker - https://github.com/SamR-DWL/DigitalWonderlab.DeclutterTypes/issues

## Screenshots
![Dashboard](https://i.postimg.cc/d0STLzYR/Declutter-Screenshot.png)

## Licence

MIT — free to use.

