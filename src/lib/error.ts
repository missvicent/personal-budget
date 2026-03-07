interface AppError {
  message: string
  code?: string
  details?: string
  hint?: string
}

export const getErrorMessage = (error: AppError): string => {
  return `Error: ${error.message || 'Unknown error'}`
}
