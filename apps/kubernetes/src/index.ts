import * as k8s from "@kubernetes/client-node";
// import { SmsCommandContextImpl } from "twilio/lib/rest/supersim/v1/smsCommand";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

async function listPods() {
  const res = await k8sApi.listNamespacedPod({
    namespace: "default",
  });

  console.log(res.items.map((p) => p.metadata?.name));
}

listPods();