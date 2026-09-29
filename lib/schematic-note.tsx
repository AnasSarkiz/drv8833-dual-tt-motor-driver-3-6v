import { Fragment } from "react"

type SchematicNoteProps = {
  schX: number
  schY: number
  lines: readonly string[]
}

// Nest notes in the described part so they inherit its sheet and position.
export function SchematicNote({ schX, schY, lines }: SchematicNoteProps) {
  return (
    <>
      {lines.map((text, index) => (
        <Fragment key={text}>
          <schematictext
            text={text}
            schX={schX}
            schY={schY - index * 0.55}
            fontSize={0.3}
            anchor="left"
            color="#243746"
          />
        </Fragment>
      ))}
    </>
  )
}
