export interface faceData {
  known: {
    image_url: string | undefined | null;
    label: string | undefined;
  }[];
  unknown: string;
}
