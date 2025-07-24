export interface GuaranteeItem {
  icon: string
  name: string
}

export interface GuaranteesL {
  id: number
  tipo: string
  titulo: string
  subtitulo: string
  itens?: GuaranteeItem[]
}