interface IStaticAlgorithmDescription {
  name: string;
  description?: string;
  memory_transform: (raw: number) => string;
}
export default IStaticAlgorithmDescription;
