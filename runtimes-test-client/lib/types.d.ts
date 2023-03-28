export declare type ClientOptions = {
  projectId: string
  dataset: string
  apiVersion: string
  useCdn: boolean
}
export default function createClient({
  projectId,
  dataset,
  apiVersion,
}: ClientOptions): {
  env: {
    [key: string]: unknown
  }
  fetch(query: string): Promise<any>
}

export declare const entry: string
