export interface HeroSection {
  id: number
  tipo: string
  titulo: string
  subtitulo: string
  subtituloMenor?: string
  layout?: 'center' | 'left' | 'right'
  corFundo?: string
  mostrarBotao?: boolean
  mostrarLink?: boolean
  usarCarrossel?: boolean
  ImagemFundo?: string
  Imagemdestaque?: string
  showImage?: boolean
  showImagemFundo?: boolean
  textLinkbotao?: string
  status?: boolean
}