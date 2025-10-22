export function mapPodStatus(
   phase: string | undefined,
): 'pending' | 'running' | 'succeeded' | 'failed' | 'terminating' | 'unknown' {
   switch (phase) {
      case 'Pending':
         return 'pending';
      case 'Running':
         return 'running';
      case 'Succeeded':
         return 'succeeded';
      case 'Failed':
         return 'failed';
      case 'Terminating':
         return 'terminating';
      default:
         return 'unknown';
   }
}
