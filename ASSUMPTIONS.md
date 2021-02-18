# Assumptions made during implementation
- `html-to-text` was used as the HTML parser, as it's performant - on production it probably would make sense to write a custom one that would also take availability and HTML semantics into account
- Parsers for data are chosen per `DataType`, but in a production environment it would make sense to choose them based on `DataType` and `source`
