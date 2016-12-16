

import { ProblemClient } from "./problem-client.model";

export interface Problem {

  level: string;
  message: string;
  package?: string;
  className?: string;
  path?: string;
  lineNumber?: number;
  client?: ProblemClient;

}



