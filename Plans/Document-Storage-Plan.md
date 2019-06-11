DOCUMENT SCHEMA:
* Date of production (`creation_date`)
    - `year` (optional)
    - `month` (optional)
    - `day` (optional)
    - `timestamp` (optional)
* Last modified (`modification_date`) (optional)
* Source (`source`) [constrained dictionary of provenance associated metadata]
    - `author_name` (optional)
    - `publisher_name` (optional)
    - `organization_name` (optional)
* Category (`category`)
* Title (`title`)
* File type (`file_type`)
* Original URL (`source_url`)
* Stored URL (`stored_url`) [S3 URI]
* ID (`_id`) [sha256 hash of original document (pdf, html, etc)]
* Extracted Text (`extracted_text`) [constrained dictionary keyed by extraction method]
    - `pdf2text`
    - `beautifulsoup`
    - `tika`
    - etc...

TODO:
* Need a way to normalize and store reading output to support variety of HMI tasks
    - Pascale: provide HMI requirements for reading output visualization
    - Ben/Brandon: sync on specific technical approach 
* Determine whether/how to handle large streaming data collection
    - Discussion point for DART kickoff

ASSUMPTIONS:
* Document schema validation to be handled by DART
    - Brandon: in short-term, update Elasticsearch index to conform to schema
    - Upload documents to S3 
    - Index additional MITRE documents to support next demo
* Start with small data sets to reduce re-reading effort and major schema changes
    - Discussion point for DART kickoff
