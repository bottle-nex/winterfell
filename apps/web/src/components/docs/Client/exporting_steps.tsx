import { FaGithub } from 'react-icons/fa';
import { Button } from '../../ui/button';
import { Step } from './getting_started_steps';

/**
 * Export Workflow Steps
 *
 * Guides users through the process of exporting LLM-generated smart contracts
 * to their GitHub repository. Covers real-time file generation monitoring and
 * GitHub account connection for seamless repository exports.
 *
 * @see Step interface from getting_started_steps
 */
export const exportingSteps: Step[] = [
    {
        number: 1,
        title: 'Live File Generation',
        description:
            'Watch your smart contract files get created in real-time as the AI generates your code.',
    },
    {
        number: 2,
        title: 'Connect GitHub Account',
        description: (
            <div className="flex flex-col gap-y-3">
                <p className="text-light/70 text-sm">
                    Authenticate with GitHub to enable seamless repository exports
                </p>
                <button className="bg-[#24292e] text-white hover:bg-[#1a1e22] px-4 py-2 rounded-[4px] font-semibold text-sm flex items-center gap-x-2 w-fit transition-transform hover:-translate-y-0.5">
                    <FaGithub className="w-4 h-4" />
                    <span>Connect GitHub</span>
                </button>
            </div>
        ),
    },
    {
        number: 3,
        title: 'Create Repository',
        description: (
            <div className="flex flex-col gap-y-3">
                <p className="text-light/70 text-sm">Choose a name for your new repository</p>
                <div className="flex flex-col gap-y-2">
                    <label htmlFor="repo-name" className="text-sm font-semibold text-light">
                        Repository name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="repo-name"
                        type="text"
                        placeholder="my-smart-contract"
                        className="bg-dark-base border border-light/20 rounded-[4px] px-3 py-2 text-light text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                    <p className="text-xs text-light/50">
                        Great repository names are short and memorable.
                    </p>
                </div>
            </div>
        ),
    },
    {
        number: 4,
        title: 'Code Checkout Completed',
        description: (
            <div className="flex flex-col gap-y-3">
                <div className="bg-[#1a7f37]/10 border border-[#1a7f37]/40 rounded-[4px] px-4 py-3 flex items-start gap-x-3">
                    <svg
                        className="w-5 h-5 text-[#2da44e] flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
                        />
                    </svg>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-[#2da44e] font-semibold text-sm">
                            Success! Your contract has been exported
                        </p>
                        <p className="text-light/70 text-xs">
                            Your smart contract files are now available in your GitHub repository
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
];
