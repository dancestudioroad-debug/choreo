"use client"

import React from 'react'

interface LinkifyTextProps {
  text: string
  className?: string
}

// Regex to match URLs
const urlRegex = /(https?:\/\/[^\s]+)/g

export function LinkifyText({ text, className = '' }: LinkifyTextProps) {
  const parts = text.split(urlRegex)
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
            >
              {part}
            </a>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </span>
  )
}

// For rendering multiline text with links
export function LinkifyBlock({ text, className = '' }: LinkifyTextProps) {
  const lines = text.split('\n')
  
  return (
    <div className={className}>
      {lines.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          <LinkifyText text={line} />
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  )
}
