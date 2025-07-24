export interface WhyUsItem {
  icon: string
  text: string
}

export interface WhyUsContext {
  id: number
  tipo: string
  title: string
  subtitle: string
  itens?: WhyUsItem[]
}