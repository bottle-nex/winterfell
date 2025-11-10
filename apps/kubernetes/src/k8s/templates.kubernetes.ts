import { V1Pod } from "@kubernetes/client-node";
import { PodConfig } from "../types/types.kubernetes";
import { env } from "../configs/configs.env";
import { pod_resources } from "./resources.kubernetes";

export default function podTemplate(configs: PodConfig) {
  const { pod_name, job_id, contract_id, user_id, code_snapshot_url, command } =
    configs;

  const podTemplate: V1Pod = {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: pod_name,
      namespace: env.KUBERNETES_NAMESPACE,
      labels: {
        app: "anchor-executor",
        "job-id": job_id,
        "contract-id": contract_id,
        "user-id": user_id,
        command: command,
      },
      annotations: {
        "created-at": new Date().toISOString(),
        "code-snapshot": code_snapshot_url,
      },
    },
    spec: {
      initContainers: [
        {
          name: "code-checkout",
          image: "amazon/aws-cli:latest",
          command: ["/bin/sh", "-c"],
          args: [
            `
                        echo "Checking out your codebase from ${code_snapshot_url}...;
                        aws s3 cp ${code_snapshot_url} /workspace/code.zip;
                        cd /workspace;
                        unzip code.zip;
                        rm code.zip;
                        echo "Code checkout complete";
                        `,
          ],
          volumeMounts: [
            {
              name: "workspace",
              mountPath: "/workspace",
            },
          ],
          env: [
            {
              name: "AWS_ACCESS_KEY_ID",
              valueFrom: {
                secretKeyRef: {
                  name: "aws-credentials",
                  key: "access-key-id",
                },
              },
            },
            {
              name: "AWS_SECRET_ACCESS_KEY",
              valueFrom: {
                secretKeyRef: {
                  name: "aws-credentials",
                  key: "secret-access-key",
                },
              },
            },
            {
              name: "AWS_REGION",
              value: "us-east-1",
            },
          ],
        },
      ],
      containers: [
        {
          name: "anchor-executor",
          image: "winterfellhubwinterfell-base:latest",
          command: ["/bin/sh", "-c"],
          args: [
            `
                        set -e;
                        cd /workspace;
                        echo "=== Starting Anchor ${command} ===";
                        echo "Working directory: $(pwd)";
                        echo "Files:";
                        ls -la;

                        # Run the actual command
                        case "${command}" in
                            build)
                                anchor build
                                ;;
                            test)
                                anchor test --skip-local-validator
                                ;;
                            deploy)
                                anchor deploy
                                ;;
                            *)
                                echo "Unknown command: ${command}";
                                exit 1
                                ;;
                        esac
                        
                        echo "=== Command completed successfully ===";
                        `,
          ],
          workingDir: "/workspace",
          volumeMounts: [
            {
              name: "workspace",
              mountPath: "/workspace",
            },
          ],
          resources: pod_resources,
          env: [
            {
              name: "RUST_BACKTRACE",
              value: "1",
            },
            {
              name: "ANCHOR_WALLET",
              value: "/workspace/.config/solana/id.json",
            },
            {
              name: "JOB_ID",
              value: job_id,
            },
            {
              name: "CONTRACT_ID",
              value: contract_id,
            },
          ],
        },
      ],
      volumes: [
        {
          name: "workspace",
          emptyDir: {},
        },
      ],

      securityContext: {
        runAsNonRoot: true,
        runAsUser: 1000,
        fsGroup: 1000,
      },
    },
  };
  return podTemplate;
}
