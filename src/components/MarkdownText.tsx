import React from 'react'

function parseInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.85em] dark:bg-white/10">{part.slice(1, -1)}</code>
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

export function MarkdownText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\n+/)

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, i) => {
        // Simple table detection
        if (block.match(/^\|?.*\|.*\n\|?[-:| ]+\|\n/)) {
          const lines = block.trim().split('\n')
          
          const parseRow = (line: string) => {
            let s = line.trim()
            if (s.startsWith('|')) s = s.slice(1)
            if (s.endsWith('|')) s = s.slice(0, -1)
            return s.split('|').map(c => c.trim())
          }

          const headers = parseRow(lines[0])
          const rows = lines.slice(2).map(parseRow)

          // If the table has 2 columns, render as a single card with key-value pairs (like the first screenshot)
          if (headers.length === 2) {
            return (
              <div key={i} className="my-1 flex flex-col gap-3 rounded-2xl bg-black/5 p-4 dark:bg-white/5">
                {(headers.length > 0) && (
                  <div className="font-bold text-ink dark:text-cream">
                    {parseInline(headers[1] || headers[0] || 'Tabel')}
                  </div>
                )}
                
                <div className="flex flex-col gap-3">
                  {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-ink/60 dark:text-cream/60">
                        {parseInline(row[0] || '')}
                      </span>
                      <span className="text-sm text-[#24527a] dark:text-[#90cdf4]">
                        {parseInline(row[1] || '')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // If the table has >2 columns, render each row as a separate card with labels
          return (
            <div key={i} className="my-1 flex flex-col gap-3">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-col gap-3 rounded-2xl bg-black/5 p-4 dark:bg-white/5">
                  <span className="font-bold text-ink dark:text-cream text-[15px]">
                    {parseInline(row[0]?.replace(/\*\*/g, '') || '')}
                  </span>
                  
                  <div className="flex flex-col gap-3">
                    {row.slice(1).map((col, colIndex) => {
                      const label = headers[colIndex + 1];
                      return (
                        <div key={colIndex} className="flex flex-col gap-0.5">
                          {label && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50 dark:text-cream/50">
                              {parseInline(label.replace(/\*\*/g, ''))}
                            </span>
                          )}
                          <span className="text-sm text-[#24527a] dark:text-[#90cdf4] leading-relaxed">
                            {parseInline(col)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )
        }
        
        // List detection
        if (block.match(/^[-*] /m)) {
            const items = block.split('\n').filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
            return (
                <ul key={i} className="list-disc pl-4 space-y-1">
                    {items.map((item, j) => (
                        <li key={j} className="text-sm leading-relaxed text-ink/90 dark:text-cream/90">{parseInline(item.replace(/^[-*]\s+/, ''))}</li>
                    ))}
                </ul>
            )
        }

        // Ordered list detection
        if (block.match(/^\d+\. /m)) {
            const items = block.split('\n').filter(l => l.match(/^\d+\. /));
            return (
                <ol key={i} className="list-decimal pl-4 space-y-1">
                    {items.map((item, j) => (
                        <li key={j} className="text-sm leading-relaxed text-ink/90 dark:text-cream/90">{parseInline(item.replace(/^\d+\.\s+/, ''))}</li>
                    ))}
                </ol>
            )
        }

        // Heading detection
        const headingMatch = block.match(/^(#{1,6})\s+(.*)/s);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const content = headingMatch[2];
            // Render as bold text with some margin, removing the # characters
            return (
                <div key={i} className={`font-bold text-ink dark:text-cream ${level <= 3 ? 'text-base mt-2' : 'text-sm mt-1'}`}>
                    {parseInline(content)}
                </div>
            )
        }

        // Standard paragraph
        return (
          <p key={i} className="whitespace-pre-wrap text-sm leading-relaxed text-ink/90 dark:text-cream/90">
            {parseInline(block)}
          </p>
        )
      })}
    </div>
  )
}
