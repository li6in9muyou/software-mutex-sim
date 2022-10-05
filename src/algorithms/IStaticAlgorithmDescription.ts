interface IStaticAlgorithmDescription {
  name: string;
  description?: string;
  max_process_count?: number;
  memory_transform: (raw: number) => string;
}
export default IStaticAlgorithmDescription;
