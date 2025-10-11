import Card from "../ui/Card";
import { useState } from "react";

export default function BuilderSettingsPanel() {
  const [settings, setSettings] = useState({
    contractType: "CUSTOM",
    network: "DEVNET",
    rpcUrl: "https://api.devnet.solana.com",
    autoGenerate: true,
    includeTests: true,
    includeClient: true,
    anchorVersion: "0.29.0",
    securityLevel: "standard",
  });

  return (
    <Card className="absolute top-full left-1/2 -translate-x-1/2 z-20 py-3 px-4 text-sm tracking-wider w-[20rem] max-h-[32rem] overflow-y-auto">
      {/* Contract Type */}
      <div className="mb-4">
        <label className="block text-xs font-semibold mb-2 text-gray-400">
          Contract Type
        </label>
        <select
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          value={settings.contractType}
          onChange={(e) =>
            setSettings({ ...settings, contractType: e.target.value })
          }
        >
          <option value="CUSTOM">Custom</option>
          <option value="TOKEN">Token</option>
          <option value="NFT">NFT</option>
          <option value="STAKING">Staking</option>
          <option value="DAO">DAO</option>
          <option value="DEFI">DeFi</option>
          <option value="MARKETPLACE">Marketplace</option>
        </select>
      </div>

      {/* Network */}
      <div className="mb-4">
        <label className="block text-xs font-semibold mb-2 text-gray-400">
          Target Network
        </label>
        <select
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          value={settings.network}
          onChange={(e) =>
            setSettings({ ...settings, network: e.target.value })
          }
        >
          <option value="DEVNET">Devnet</option>
          <option value="TESTNET">Testnet</option>
          <option value="MAINNET_BETA">Mainnet Beta</option>
        </select>
      </div>

      {/* RPC URL */}
      <div className="mb-4">
        <label className="block text-xs font-semibold mb-2 text-gray-400">
          RPC URL
        </label>
        <input
          type="text"
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
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
        <select
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          value={settings.anchorVersion}
          onChange={(e) =>
            setSettings({ ...settings, anchorVersion: e.target.value })
          }
        >
          <option value="0.30.0">0.30.0 (Latest)</option>
          <option value="0.29.0">0.29.0</option>
          <option value="0.28.0">0.28.0</option>
        </select>
      </div>

      <div className="border-t border-gray-700 my-4"></div>

      {/* Generation Options */}
      <div className="mb-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoGenerate}
            onChange={(e) =>
              setSettings({ ...settings, autoGenerate: e.target.checked })
            }
            className="mr-2"
          />
          <span className="text-sm">Auto-generate on prompt send</span>
        </label>
        <p className="text-xs text-gray-500 ml-6">
          Generate code immediately when you send a message
        </p>
      </div>

      <div className="mb-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.includeTests}
            onChange={(e) =>
              setSettings({ ...settings, includeTests: e.target.checked })
            }
            className="mr-2"
          />
          <span className="text-sm">Generate test suite</span>
        </label>
        <p className="text-xs text-gray-500 ml-6">
          Include TypeScript tests for all instructions
        </p>
      </div>

      <div className="mb-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.includeClient}
            onChange={(e) =>
              setSettings({ ...settings, includeClient: e.target.checked })
            }
            className="mr-2"
          />
          <span className="text-sm">Generate client SDK</span>
        </label>
        <p className="text-xs text-gray-500 ml-6">
          Create TypeScript client after build
        </p>
      </div>

      <div className="border-t border-gray-700 my-4"></div>

      {/* Security Level */}
      <div className="mb-4">
        <label className="block text-xs font-semibold mb-2 text-gray-400">
          Security Level
        </label>
        <select
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          value={settings.securityLevel}
          onChange={(e) =>
            setSettings({ ...settings, securityLevel: e.target.value })
          }
        >
          <option value="basic">Basic (Faster generation)</option>
          <option value="standard">Standard (Recommended)</option>
          <option value="strict">Strict (Production-ready)</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {settings.securityLevel === "basic" && "Basic checks only"}
          {settings.securityLevel === "standard" &&
            "Access control + error handling"}
          {settings.securityLevel === "strict" && "Full audit + best practices"}
        </p>
      </div>

      {/* Temperature/Creativity (Advanced) */}
      <details className="mb-2">
        <summary className="text-xs font-semibold text-gray-400 cursor-pointer hover:text-gray-300">
          Advanced Options
        </summary>
        <div className="mt-3 pl-2">
          <label className="block text-xs font-semibold mb-2 text-gray-400">
            AI Temperature (0-1)
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            defaultValue="0.2"
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Lower = more deterministic code
          </p>

          <div className="mt-3">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={false} className="mr-2" />
              <span className="text-xs">Enable code comments</span>
            </label>
          </div>

          <div className="mt-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={true} className="mr-2" />
              <span className="text-xs">Optimize for compute units</span>
            </label>
          </div>
        </div>
      </details>

      {/* Save/Reset */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-700">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors">
          Save Settings
        </button>
        <button className="px-3 py-2 text-gray-400 hover:text-white text-xs transition-colors">
          Reset
        </button>
      </div>
    </Card>
  );
}
