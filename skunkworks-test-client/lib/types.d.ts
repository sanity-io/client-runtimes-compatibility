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
  fetch(query: string): Promise<any>
}

export declare const environment: string
export declare const condition: string
