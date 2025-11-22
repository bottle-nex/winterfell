import { JSX } from "react";
import ArchitectureTitleComponent from "../base/ArchitectureTitleComponent";

interface Review {
  name: string;
  role: string;
  review: string;
  rating: number;
}

const reviews: Review[] = [
  {
    name: "Ser Brienne of Tarth",
    role: "Smart Contract Knight",
    review: "Finally, a platform that doesn't make me want to throw my laptop out the window. Deployed my first Solana program without sacrificing a goat.",
    rating: 5
  },
  {
    name: "Tyrion Lannister",
    role: "DeFi Architect",
    review: "I drink and I know things. Mostly about Rust now, thanks to Winterfell's AI. 10/10 would recommend while drunk.",
    rating: 5
  },
  {
    name: "Arya Stark",
    role: "No-Code Assassin",
    review: "A girl has no name, but her smart contracts have perfect IDLs. Valar Morghulis to manual coding.",
    rating: 5
  },
  {
    name: "Jon Snow",
    role: "Blockchain Bastard",
    review: "I knew nothing about Anchor. Now I know something. Character development arc complete.",
    rating: 5
  },
  {
    name: "Daenerys Targaryen",
    role: "Mother of Contracts",
    review: "I will take what is mine with fire and blood... or just use Winterfell's one-click deploy. Way easier.",
    rating: 5
  },
  {
    name: "Hodor",
    role: "Backend Developer",
    review: "Hodor hodor hodor hodor. Hodor hodor hodor! (Translation: Best dev tool ever. Seriously.)",
    rating: 5
  },
  {
    name: "Cersei Lannister",
    role: "Frontend Queen",
    review: "When you play the game of smart contracts, you win or you debug. With Winterfell, you win. Every. Single. Time.",
    rating: 5
  },
  {
    name: "The Night King",
    role: "Security Auditor",
    review: "Been dead for centuries, came back just to use this. AI caught vulnerabilities even I missed. Spooky good.",
    rating: 5
  }
];

const reviews2: Review[] = [
  {
    name: "Samwell Tarly",
    role: "Documentation Writer",
    review: "Auto-generated docs better than what I could write in the Citadel library. My maester chain feels inadequate now.",
    rating: 5
  },
  {
    name: "Sansa Stark",
    role: "Product Manager",
    review: "Survived Ramsay Bolton and managed enterprise deployments. Winterfell is easier than both.",
    rating: 5
  },
  {
    name: "Jaime Lannister",
    role: "Full-Stack Swordsman",
    review: "Lost my right hand, gained AI-powered contract generation. Fair trade tbh.",
    rating: 5
  },
  {
    name: "Bran Stark",
    role: "Three-Eyed Developer",
    review: "I can see the past, present, and future. In all timelines, Winterfell is the best platform.",
    rating: 5
  },
  {
    name: "Melisandre",
    role: "Token Priestess",
    review: "The night is dark and full of bugs. Winterfell is the light that brings the dawn. For the watch!",
    rating: 5
  },
  {
    name: "Tormund Giantsbane",
    role: "Wildling Engineer",
    review: "I've wrestled bears and giants. Deploying smart contracts was harder. Was. Past tense.",
    rating: 5
  },
  {
    name: "Varys",
    role: "Network Spy",
    review: "I have little birds everywhere. They all whisper the same thing: Winterfell slaps harder than Joffrey.",
    rating: 5
  },
  {
    name: "Theon Greyjoy",
    role: "Redemption Arc Dev",
    review: "What is dead may never die. What is deployed on Winterfell never breaks. Probably.",
    rating: 5
  }
];

interface ReviewCardProps {
  review: Review;
  index: number;
}

function ReviewCard({ review, index }: ReviewCardProps): JSX.Element {
  const isLight: boolean = index % 2 === 0;
  
  return (
    <div className={`mx-4 min-w-[400px] max-w-[400px] ${isLight ? 'bg-[#fdf9f0]' : 'bg-[#1a1a1a]'} border ${isLight ? 'border-[#e5e0d5]' : 'border-[#333]'} rounded-lg p-6 flex-shrink-0`}>
      <div className="flex gap-1 mb-3">
        {[...Array(review.rating)].map((_, i: number) => (
          <svg key={i} className="w-5 h-5 fill-[#6c44fc]" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      <p className={`${isLight ? 'text-gray-700' : 'text-gray-300'} text-sm mb-4 leading-relaxed text-left`}>{review.review}</p>
      <div className={`border-t ${isLight ? 'border-[#e5e0d5]' : 'border-[#333]'} pt-4`}>
        <p className={`${isLight ? 'text-gray-900' : 'text-white'} font-semibold text-left`}>{review.name}</p>
        <p className={`${isLight ? 'text-gray-600' : 'text-gray-500'} text-sm text-left`}>{review.role}</p>
      </div>
    </div>
  );
}

interface MarqueeRowProps {
  reviews: Review[];
  duration: number;
}

function MarqueeRow({ reviews, duration }: MarqueeRowProps): JSX.Element {
  return (
    <div className="relative overflow-hidden py-4">
      <div 
        className="flex animate-marquee"
        style={{
          animation: `marquee ${duration}s linear infinite`
        }}
      >
        {[...reviews, ...reviews].map((review: Review, idx: number) => (
          <ReviewCard key={idx} review={review} index={idx} />
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export default function ReviewsSection(): JSX.Element {
  return (
    <div className="min-h-screen bg-primary z-20 py-12">
      <ArchitectureTitleComponent 
        firstText="Winter tales" 
        secondText="from the Wall" 
        bordercolor="border-[#141517]" 
        bgcolor="bg-[#6c44fc]" 
      />
      
      <div className="mt-16 space-y-6">
        <MarqueeRow reviews={reviews} duration={40} />
        <MarqueeRow reviews={reviews2} duration={50} />
      </div>
    </div>
  );
}