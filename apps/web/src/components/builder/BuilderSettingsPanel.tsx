import { useRef, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useHandleClickOutside } from "@/src/hooks/useHandleClickOutside";
import Sidebar from "../ui/Sidebar";

interface BuilderSettingsPanelProps {
    openSettingsPanel: boolean;
    setOpenSettingsPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BuilderSettingsPanel({ openSettingsPanel, setOpenSettingsPanel }: BuilderSettingsPanelProps) {
    const settingsRef = useRef<HTMLDivElement>(null);
    useHandleClickOutside([settingsRef], setOpenSettingsPanel);
    const [settings, setSettings] = useState({
        contractType: 'CUSTOM',
        network: 'DEVNET',
        rpcUrl: 'https://api.devnet.solana.com',
        autoGenerate: true,
        includeTests: true,
        includeClient: true,
        anchorVersion: '0.29.0',
        securityLevel: 'standard'
    });

    return (
        <Sidebar open={openSettingsPanel}
            setOpen={setOpenSettingsPanel}
            width="40rem"
            content={
                <>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-2 text-gray-400">
                            Contract Type
                        </label>
                        <Select
                            value={settings.contractType}
                            onValueChange={(value) => setSettings({ ...settings, contractType: value })}
                        >
                            <SelectTrigger className="w-full border-neutral-800 text-light">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent container={settingsRef.current} className="bg-dark-base border-neutral-800 text-light">
                                <SelectItem value="CUSTOM">Custom</SelectItem>
                                <SelectItem value="TOKEN">Token</SelectItem>
                                <SelectItem value="NFT">NFT</SelectItem>
                                <SelectItem value="STAKING">Staking</SelectItem>
                                <SelectItem value="DAO">DAO</SelectItem>
                                <SelectItem value="DEFI">DeFi</SelectItem>
                                <SelectItem value="MARKETPLACE">Marketplace</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-2 text-gray-400">
                            Target Network
                        </label>
                        <Select
                            value={settings.network}
                            onValueChange={(value) => setSettings({ ...settings, network: value })}
                        >
                            <SelectTrigger className="w-full border-neutral-800 text-light">
                                <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                            <SelectContent container={settingsRef.current} className="bg-dark-base border-neutral-800 text-light">
                                <SelectItem value="DEVNET">Devnet</SelectItem>
                                <SelectItem value="TESTNET">Testnet</SelectItem>
                                <SelectItem value="MAINNET_BETA">Mainnet Beta</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-2 text-gray-400">
                            RPC URL
                        </label>
                        <Input
                            type="text"
                            className="w-full !bg-dark hover:bg-dark/80 border border-neutral-800 !rounded-[4px] px-3 py-2 text-sm text-light focus:outline-none focus:border-blue-500"
                            value={settings.rpcUrl}
                            onChange={(e) => setSettings({ ...settings, rpcUrl: e.target.value })}
                            placeholder="https://api.devnet.solana.com"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Used for deployment and testing
                        </p>
                    </div>

                    {/* Anchor Version */}
                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-2 text-gray-400">
                            Anchor Version
                        </label>
                        <Select
                            value={settings.anchorVersion}
                            onValueChange={(value) => setSettings({ ...settings, anchorVersion: value })}
                        >
                            <SelectTrigger className="w-full border-neutral-800 text-light">
                                <SelectValue placeholder="Select version" />
                            </SelectTrigger>
                            <SelectContent container={settingsRef.current} className="bg-dark-base border-neutral-800 text-light">
                                <SelectItem value="0.30.0">0.30.0 (Latest)</SelectItem>
                                <SelectItem value="0.29.0">0.29.0</SelectItem>
                                <SelectItem value="0.28.0">0.28.0</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-800">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded [4px]xt-xs font-medium transition-colors">
                            Save Settings
                        </Button>
                        <Button className="px-3 py-2 text-gray-400 hover:text-white text-xs transition-colors">
                            Reset
                        </Button>
                    </div>
                </>
            }
        />
    );
}