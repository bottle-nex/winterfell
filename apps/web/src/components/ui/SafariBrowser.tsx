import { SVGProps } from 'react';

type SafariMode = 'default' | 'simple';

export interface SafariProps extends SVGProps<SVGSVGElement> {
    url?: string;
    imageSrc?: string;
    videoSrc?: string;
    _mode?: SafariMode;
    className?: string;
}

export default function SafariBrowser({
    imageSrc,
    videoSrc,
    url,
    _mode = 'default',
    className,
    ...props
}: SafariProps) {
    return (
        <svg
            viewBox="0 0 1203 753"
            xmlns="http://www.w3.org/2000/svg"
            className={`w-full h-auto ${className}`}
            {...props}
        >
            <g clipPath="url(#path0)">
                <path
                    d="M0 52H1202V741C1202 747.627 1196.63 753 1190 753H12C5.37258 753 0 747.627 0 741V52Z"
                    className="fill-[#404040]"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 12C0 5.37258 5.37258 0 12 0H1190C1196.63 0 1202 5.37258 1202 12V52H0L0 12Z"
                    className="fill-[#404040]"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.06738 12C1.06738 5.92487 5.99225 1 12.0674 1H1189.93C1196.01 1 1200.93 5.92487 1200.93 12V51H1.06738V12Z"
                    className="fill-[#262626]"
                />
                <circle cx="27" cy="25" r="6" className="fill-[#ff5c5f]" />
                <circle cx="47" cy="25" r="6" className="fill-[#fac800]" />
                <circle cx="67" cy="25" r="6" className="fill-[#34c759]" />

                <path
                    d="M286 17C286 13.6863 288.686 11 292 11H946C949.314 11 952 13.6863 952 17V35C952 38.3137 949.314 41 946 41H292C288.686 41 286 38.3137 286 35V17Z"
                    className="fill-[#404040]"
                />
                <g className="mix-blend-luminosity">
                    <text
                        x="580"
                        y="30"
                        fill="#A3A3A3"
                        fontSize="12"
                        fontFamily="Arial, sans-serif"
                    >
                        {url}
                    </text>
                </g>

                {/* content (image/video) */}
                {imageSrc && (
                    <image
                        href={imageSrc}
                        x="1"
                        y="52"
                        width="1200"
                        height="700"
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="url(#roundedBottom)"
                    />
                )}
                {videoSrc && (
                    <foreignObject
                        x="1"
                        y="52"
                        width="1200"
                        height="700"
                        clipPath="url(#roundedBottom)"
                    >
                        <video
                            className="w-full h-full object-cover"
                            src={videoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </foreignObject>
                )}
            </g>
            <defs>
                <clipPath id="path0">
                    <rect width="1203" height="753" fill="white" />
                </clipPath>
                <clipPath id="roundedBottom">
                    <path
                        d="M1 52H1201V741C1201 747.075 1196.08 752 1190 752H12C5.92486 752 1 747.075 1 741V52Z"
                        fill="white"
                    />
                </clipPath>
            </defs>
        </svg>
    );
}