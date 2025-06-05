// Interface para erros do Firebase
export interface FirebaseError extends Error {
  code: string
  customData?: unknown
}
