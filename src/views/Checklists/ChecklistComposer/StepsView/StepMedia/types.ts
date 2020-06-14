export interface StepMedia {
  id: number;
  name: string;
  link: string;
  type: string;
  filename: string;
}

export interface StepMediaProps {
  medias: StepMedia[];
}
