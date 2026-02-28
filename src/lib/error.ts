interface Error {
  message: string
  code: string
  details: string
  hint: string
}

export const getErrorMessage = (error: Error): string => {
  return `Error: ${error.message || 'Unknown error'}`
}
