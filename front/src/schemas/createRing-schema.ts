import { z } from 'zod'

export const ringSchema = z.object({
  name: z.string().max(16, 'O nome deve ter menos de 16 caracteres'),
  power: z
    .string()
    .min(1, 'Poder não pode ser vazio')
    .max(1000, 'A descrição do poder deve ter menos de 1000 caracteres'),
  image: z
    .string()
    .min(10, { message: 'URL precisa ter pelo menos 10 caracteres.' })
    .max(255, { message: 'URL não pode ter mais de 255 caracteres.' })
    .url('URL da imagem inválida'),
})
