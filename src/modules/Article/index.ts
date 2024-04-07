import { SliceContext } from "@/core/context";

export default function getSlice(): SliceContext {
  return {}
} 

export const ExportModule = {
  test: 'test',
}

declare module "@/core/context" {
  interface SliceModule {
    article: typeof ExportModule
  }
}