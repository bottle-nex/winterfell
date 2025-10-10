enum Network {
    DEVNET = 'DEVNET',
    TESTNET = 'TESTNET',
    MAINNET_BETA = 'MAINNET_BETA',
}

interface NetworkTickerProps {
    network?: Network;
}

export default function NetworkTicker({ network = Network.DEVNET }: NetworkTickerProps) {
    const getTicker = () => {
        switch (network) {
            case Network.DEVNET:
                return { label: 'Devnet', className: 'bg-purple-500/40 border border-purple-500' };
            case Network.TESTNET:
                return { label: 'Testnet', className: 'bg-yellow-500/40 border border-yellow-500' };
            case Network.MAINNET_BETA:
                return {
                    label: 'Mainnet Beta',
                    className: 'bg-green-500/40 border border-green-500',
                };
            default:
                return { label: 'Unknown', className: 'bg-gray-500' };
        }
    };

    const { label, className } = getTicker();

    return (
        <div className="overflow-hidden w-fit relative">
            <div
                className={`whitespace-nowrap px-3 py-1 rounded-[4px] text-sm font-medium text-white ${className} animate-ticker tracking-wider`}
            >
                {label}
            </div>
        </div>
    );
}
