
import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'poster-01',
    code: 'FIGMA_EXP_01',
    title: 'VISIÓN ANALÓGICA 093',
    date: '2024.03.15', 
    description: 'Intervención multimedia que fusiona hardware analógico con gráficos vectoriales vibrantes. La pantalla como lienzo para patrones hipnóticos y simbología moderna.',
    tags: ['POSTER', 'TYPOGRAPHY', 'SWISS'],
    color: '#F2F0E9',
    texture: 'rough', 
    imageUrl: 'images/Group 283.png', 
    stats: [10, 25, 40, 35, 60, 80, 50, 90, 20, 10],
    aspectRatio: 0.7 // Portrait (vertical)
  },
  {
    id: 'poster-02',
    code: 'FIGMA_EXP_02',
    title: 'ERROR TÉRMICO',
    date: '2024.02.10',
    description: 'Diseño de activos digitales basado en la estética de recibos térmicos y errores de impresión. Un ejercicio de glitch art y branding experimental.',
    tags: ['LAYOUT', 'GRID', 'MINIMAL'],
    color: '#E6E2D6',
    texture: 'recycled',
    imageUrl: 'images/Group 284.png',
    stats: [50, 55, 60, 50, 45, 60, 75, 80, 90, 100],
    aspectRatio: 1.0 // Square
  },
  {
    id: 'poster-03',
    code: 'FIGMA_EXP_03',
    title: 'TICKET DE ADVERTENCIA',
    date: '2024.01.22',
    description: 'Reinterpretación de la filatelia tradicional mediante ilustración técnica y texturas de papel. Una pieza de diseño gráfico centrada en el detalle y la advertencia visual.',
    tags: ['COLOR', 'PRINT', 'ART'],
    color: '#D4D4D8',
    texture: 'smooth',
    imageUrl: 'images/Group 74.png',
    stats: [90, 85, 80, 70, 60, 50, 40, 30, 20, 10],
    aspectRatio: 1.4 // Landscape (horizontal)
  },
  {
    id: 'poster-04',
    code: 'FIGMA_EXP_04',
    title: 'DOWN THE RABBIT HOLE',
    date: '2023.12.05',
    description: 'Diseño de packaging conceptual para "Down the Rabbit Hole". Un enfoque en la materialidad plástica, transparencias y la cultura del objeto físico en la era digital.',
    tags: ['3D', 'BLENDER', 'COMPOSITION'],
    color: '#8A8580',
    texture: 'rough',
    imageUrl: 'images/Group 97.png',
    stats: [20, 30, 10, 50, 40, 60, 80, 20, 50, 70],
    aspectRatio: 1.2 // Adjusted to match UI_CONCEPT proportions
  },
  {
    id: 'poster-05',
    code: 'FIGMA_EXP_05',
    title: 'IDENTIDAD',
    date: '2023.11.18',
    description: 'Exploración de tipografía expresiva y composición editorial sobre texturas orgánicas. Una pieza que juega con la nostalgia visual y el contraste de jerarquías.',
    tags: ['UI/UX', 'CONCEPT', 'DIGITAL'],
    color: '#2C2B29',
    texture: 'smooth',
    imageUrl: 'images/Group 12.png',
    stats: [45, 45, 45, 45, 90, 90, 45, 45, 45, 45],
    aspectRatio: 1.2 // Landscape (wide)
  }
];

export const NOISE_OPACITY = 0.4;
