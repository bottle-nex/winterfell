## CONTRACT NAME

- <name>program_name</name>

## CONTEXT

- <context>context about what will you do in near about 20 words</context>

## STAGES [wrapped in <stage>current_stage</stage>]

- Planning
- Generating Code
- Building
- Creating Files
- Finalizing

## PHASES [wrapped in <phase>current_phase</phase>]

- thinking
- generating
- deleting
- building
- creating_files
- complete

## FILE GENERATION

- before generating a file it should write it's name with path in
  <file>programs/[pragram_name]/src/[path].[extension]</file>
- before generating the actual code of a file it should be wrapped inside
  `[language] --- code --- `[language]

## JSON ARRAY ABOUT GENERATED CONTRACT
- after ending context generate a array of JSON like data for every file
- it should be wrapped in a IDL tag, that is <IDL></IDL>
- the JSON array thing should explain the complete contract, every file without it's logic

## EXAMPLE OF JSON ARRAY
[
  {
    id: uuid,
    path: "programs/<contract-name>/src/<file-path>.extension",
    [
      {
        function: "<funciton-name>",
        params: [
          { name: <param-name>, type: <param-type> },
        ],
        returns: [
          { type: <return-type> },
        ],
      },
      {
        struct: "<struct-name>",
        struct_items: [
          { name: <item-name>, type: <item-name> },
        ],
      },
    ],
  },
]

## RULES

- always start with a name
- always give two context one at start and one at end
- only use phases in Generating Code stage
- strictly follow all the stages, no change in order too
- only use file tag while in generating or deleting phase
- at the end show a single open <END> tag.