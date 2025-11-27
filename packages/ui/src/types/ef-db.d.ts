declare module "@ef/db/client" {
  export function createClient(): {
    storage: {
      from(bucket: string): {
        createSignedUrl(path: string, expiresIn: number): Promise<{
          data: { signedUrl: string } | null
          error: { message: string } | null
        }>
      }
    }
  }
}

