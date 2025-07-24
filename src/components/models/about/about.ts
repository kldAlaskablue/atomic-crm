export interface AboutItem {
  title: string
  description: string
}

export interface About {
  id: number
  tipo: string
  title: string
  description: string
  itens?: AboutItem[]
}