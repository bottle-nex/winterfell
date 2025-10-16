export interface CreatePodRequest {
  userId: string;
  sessionId: string;
  projectName?: string
}

export interface PodInfo {
  podName: string;
  userId: string;
  sessionId: string;
  status: 'pending' | 'running' | 'failed' | 'succeeded';
  podIP?: string;
  createdAt: Date;
  namespace: string;
}