interface TableBlockValue {
  title?: string
  headers?: string[]
  rows?: Array<{ cells?: string[] }>
}

/** Data table — navy header row with a yellow edge, soft zebra rows. */
export function TableBlock({ value }: { value: TableBlockValue }) {
  const { title, headers, rows } = value
  const hasHeaders = (headers?.length ?? 0) > 0
  if (!hasHeaders && !(rows?.length)) return null

  return (
    <div className="sv-block" style={{ margin: '30px 0' }}>
      {title && <div className="sv-table-title">{title}</div>}
      <div className="sv-table-wrap">
        <table className="sv-table">
          {hasHeaders && (
            <thead>
              <tr>{(headers ?? []).map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
          )}
          <tbody>
            {(rows ?? []).map((row, ri) => (
              <tr key={ri}>
                {(row.cells ?? []).map((cell, ci) => <td key={ci}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
