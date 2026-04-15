import generatedData from "@/data/rivalry.generated.json";
import { RivalryData } from "@/types/rivalry";

// TODO: Swap this import to an NHL-backed generated artifact when the precompute
// pipeline moves off mock data. The UI should continue reading the same shape.
export const rivalryData = generatedData as RivalryData;
