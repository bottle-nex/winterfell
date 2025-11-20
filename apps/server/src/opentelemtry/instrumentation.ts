import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { logs } from '@opentelemetry/api-logs';

const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'winterfell-api-service',
    [ATTR_SERVICE_VERSION]: '1.0.0',
});

const loggerExporter = new OTLPLogExporter({
    url: 'http://localhost:4318/v1/logs',
});

const loggerProvider = new LoggerProvider({
    resource,
    processors: [new BatchLogRecordProcessor(loggerExporter)],
});

logs.setGlobalLoggerProvider(loggerProvider);

const sdk = new NodeSDK({
    resource,
    traceExporter: new OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces',
    }),
    instrumentations: [
        getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-dns': { enabled: false },
            '@opentelemetry/instrumentation-net': { enabled: false },
        }),
    ],
});
console.log('starting the sdk');
sdk.start();

process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => loggerProvider.shutdown())
        .then(() => console.log('Tracing and logging terminated'))
        .catch((err) => console.error('Error during shutdown', err))
        .finally(() => process.exit(0));
});
