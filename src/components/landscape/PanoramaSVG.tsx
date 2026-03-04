export default function PanoramaSVG() {
  return (
    <svg
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMax meet"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sky gradient — cool blue left to warm sunset right */}
        <linearGradient id="skyGrad" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#b8d4e8" />
          <stop offset="35%" stopColor="#c9dde8" />
          <stop offset="65%" stopColor="#f0d9b5" />
          <stop offset="100%" stopColor="#f2b87a" />
        </linearGradient>

        {/* Mountain rock */}
        <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a8fa6" />
          <stop offset="100%" stopColor="#5a6d82" />
        </linearGradient>

        {/* Snow cap shimmer */}
        <linearGradient id="snowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e8f0f8" />
          <stop offset="100%" stopColor="#d4e4f0" />
        </linearGradient>

        {/* Forest floor */}
        <linearGradient id="forestFloor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c8d8c4" />
          <stop offset="50%" stopColor="#8a9e6b" />
          <stop offset="100%" stopColor="#c2a87d" />
        </linearGradient>

        {/* Sand gradient */}
        <linearGradient id="sandGrad" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#e8d5a8" />
          <stop offset="60%" stopColor="#f0ddb0" />
          <stop offset="100%" stopColor="#d4b87a" />
        </linearGradient>

        {/* Ocean deep */}
        <linearGradient id="oceanDeep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e8a8a" />
          <stop offset="100%" stopColor="#0d6e6e" />
        </linearGradient>

        {/* Ocean mid */}
        <linearGradient id="oceanMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2aa8a0" />
          <stop offset="100%" stopColor="#1a8a82" />
        </linearGradient>

        {/* Ocean surface */}
        <linearGradient id="oceanSurf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4cc8be" />
          <stop offset="100%" stopColor="#2aaa9e" />
        </linearGradient>

        {/* Horizon glow */}
        <radialGradient id="horizonGlow" cx="0.85" cy="0.45" r="0.35">
          <stop offset="0%" stopColor="#f5c87a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f5c87a" stopOpacity="0" />
        </radialGradient>

        {/* Palm trunk gradient */}
        <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6b4a2e" />
          <stop offset="50%" stopColor="#8a6240" />
          <stop offset="100%" stopColor="#5a3d26" />
        </linearGradient>

        {/* Snow mountain shadow */}
        <linearGradient id="rockShadow" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#4a5a70" />
          <stop offset="100%" stopColor="#6a7a90" />
        </linearGradient>

        {/* Wave foam filter */}
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ═══════════════════════════════════════════════ */}
      {/* SKY BACKGROUND                                 */}
      {/* ═══════════════════════════════════════════════ */}
      <rect width="1200" height="400" fill="url(#skyGrad)" />
      <rect width="1200" height="400" fill="url(#horizonGlow)" />

      {/* Wispy clouds */}
      <ellipse cx="180" cy="100" rx="60" ry="12" fill="white" opacity="0.3" />
      <ellipse cx="200" cy="96" rx="40" ry="10" fill="white" opacity="0.25" />
      <ellipse cx="500" cy="80" rx="70" ry="10" fill="white" opacity="0.2" />
      <ellipse cx="520" cy="76" rx="45" ry="8" fill="white" opacity="0.18" />
      <ellipse cx="850" cy="110" rx="55" ry="9" fill="white" opacity="0.25" />
      <ellipse cx="1050" cy="90" rx="50" ry="8" fill="white" opacity="0.2" />

      {/* ═══════════════════════════════════════════════ */}
      {/* ZONE 1: SNOW MOUNTAINS (0–300)                 */}
      {/* ═══════════════════════════════════════════════ */}

      {/* Far peak (behind) */}
      <polygon points="30,320 130,130 230,320" fill="url(#rockShadow)" opacity="0.6" />
      <polygon points="30,320 130,130 155,190 80,260" fill="#4a5a70" opacity="0.3" />

      {/* Main peak — left */}
      <polygon points="0,350 120,110 260,350" fill="url(#rockGrad)" />
      {/* Snow cap */}
      <polygon points="90,145 120,110 150,145 140,170 100,170" fill="url(#snowGrad)" />
      {/* Shadow face */}
      <polygon points="120,110 0,350 60,350 120,170" fill="#4a5a70" opacity="0.25" />

      {/* Main peak — right (taller) */}
      <polygon points="140,380 270,90 400,380" fill="url(#rockGrad)" />
      {/* Snow cap */}
      <polygon points="240,130 270,90 300,130 295,165 245,165" fill="url(#snowGrad)" />
      {/* Shadow face */}
      <polygon points="270,90 140,380 200,380 270,180" fill="#4a5a70" opacity="0.2" />

      {/* Snow texture dots on peaks */}
      <circle cx="115" cy="135" r="1.5" fill="white" opacity="0.7" />
      <circle cx="130" cy="150" r="1" fill="white" opacity="0.5" />
      <circle cx="105" cy="160" r="1.2" fill="white" opacity="0.6" />
      <circle cx="145" cy="142" r="0.8" fill="white" opacity="0.5" />
      <circle cx="260" cy="120" r="1.5" fill="white" opacity="0.7" />
      <circle cx="275" cy="135" r="1" fill="white" opacity="0.6" />
      <circle cx="250" cy="145" r="1.3" fill="white" opacity="0.5" />
      <circle cx="288" cy="128" r="0.9" fill="white" opacity="0.55" />
      <circle cx="282" cy="155" r="1.1" fill="white" opacity="0.45" />

      {/* Snowy ground base */}
      <path
        d="M0,350 Q60,335 120,340 Q180,330 240,345 Q300,335 340,350 L340,400 L0,400 Z"
        fill="#dce8f0"
      />
      <path
        d="M0,360 Q80,350 160,358 Q220,348 300,360 L340,355 L340,400 L0,400 Z"
        fill="#c8dce8"
        opacity="0.5"
      />

      {/* ── Ski poles (crossed) ── */}
      <g transform="translate(85, 310)">
        <line x1="0" y1="0" x2="18" y2="50" stroke="#5a6d82" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="0" x2="0" y2="50" stroke="#5a6d82" strokeWidth="2.5" strokeLinecap="round" />
        {/* Pole baskets */}
        <circle cx="16" cy="44" r="4" fill="none" stroke="#5a6d82" strokeWidth="1.2" />
        <circle cx="2" cy="44" r="4" fill="none" stroke="#5a6d82" strokeWidth="1.2" />
        {/* Grips */}
        <circle cx="0" cy="0" r="3" fill="#e8763a" />
        <circle cx="18" cy="0" r="3" fill="#e8763a" />
      </g>

      {/* ── Skis leaning on rock ── */}
      <g transform="translate(195, 320)">
        {/* Small rock */}
        <ellipse cx="15" cy="40" rx="18" ry="8" fill="#7a8a96" />
        <ellipse cx="15" cy="38" rx="16" ry="6" fill="#8a9aa6" />
        {/* Ski 1 */}
        <rect x="4" y="-10" width="4" height="52" rx="2" fill="#6bb5d9" transform="rotate(-8, 6, 20)" />
        <rect x="4" y="-12" width="4" height="6" rx="2" fill="#4a9ac0" transform="rotate(-8, 6, 20)" />
        {/* Ski 2 */}
        <rect x="16" y="-5" width="4" height="48" rx="2" fill="#e8763a" transform="rotate(5, 18, 20)" />
        <rect x="16" y="-7" width="4" height="6" rx="2" fill="#c4612e" transform="rotate(5, 18, 20)" />
      </g>

      {/* ═══════════════════════════════════════════════ */}
      {/* ZONE 2: EVERGREEN FOREST (250–650)             */}
      {/* ═══════════════════════════════════════════════ */}

      {/* Forest ground — smooth blend from snow */}
      <path
        d="M280,350 Q340,340 400,348 Q460,338 520,345 Q580,340 640,350 L660,350 L660,400 L280,400 Z"
        fill="url(#forestFloor)"
      />
      {/* Darker forest floor layer */}
      <path
        d="M300,358 Q380,348 440,355 Q520,345 600,355 L660,350 L660,400 L300,400 Z"
        fill="#5a7048"
        opacity="0.4"
      />

      {/* Pine trees — back row (smaller, lighter) */}
      <g opacity="0.6">
        <polygon points="290,340 300,250 310,340" fill="#2e7d4f" />
        <polygon points="370,342 382,240 394,342" fill="#1a6b3a" />
        <polygon points="540,338 550,260 560,338" fill="#2e7d4f" />
      </g>

      {/* Pine trees — front row (larger, more detailed) */}
      {/* Tree 1 */}
      <g>
        <rect x="326" y="335" width="6" height="25" fill="#5a3d26" />
        <polygon points="300,345 329,220 358,345" fill="#2e7d4f" />
        <polygon points="308,320 329,240 350,320" fill="#3a9960" />
        <polygon points="315,295 329,255 343,295" fill="#2e8a50" />
      </g>

      {/* Tree 2 (tallest) */}
      <g>
        <rect x="418" y="330" width="7" height="30" fill="#5a3d26" />
        <polygon points="385,348 421,195 457,348" fill="#1a6b3a" />
        <polygon points="394,318 421,215 448,318" fill="#258a45" />
        <polygon points="402,290 421,235 440,290" fill="#30a058" />
        <polygon points="408,268 421,250 434,268" fill="#3aaa60" />
      </g>

      {/* Tree 3 */}
      <g>
        <rect x="485" y="338" width="5" height="22" fill="#5a3d26" />
        <polygon points="462,348 488,240 514,348" fill="#2e7d4f" />
        <polygon points="468,322 488,258 508,322" fill="#3a9960" />
        <polygon points="475,298 488,270 501,298" fill="#2e8a50" />
      </g>

      {/* Tree 4 */}
      <g>
        <rect x="568" y="340" width="5" height="20" fill="#5a3d26" />
        <polygon points="548,350 571,260 594,350" fill="#1a6b3a" />
        <polygon points="554,328 571,278 588,328" fill="#258a45" />
        <polygon points="559,306 571,288 583,306" fill="#30a058" />
      </g>

      {/* Tree 5 — smaller, transition to beach */}
      <g>
        <rect x="624" y="345" width="4" height="18" fill="#5a3d26" />
        <polygon points="608,352 626,280 644,352" fill="#2e7d4f" />
        <polygon points="614,332 626,295 638,332" fill="#3a9960" />
      </g>

      {/* Scattered undergrowth bushes */}
      <ellipse cx="350" cy="348" rx="15" ry="8" fill="#2a6a40" opacity="0.5" />
      <ellipse cx="450" cy="352" rx="12" ry="6" fill="#3a8a55" opacity="0.4" />
      <ellipse cx="520" cy="346" rx="14" ry="7" fill="#2a6a40" opacity="0.45" />
      <ellipse cx="600" cy="350" rx="10" ry="5" fill="#4a9a65" opacity="0.35" />

      {/* ═══════════════════════════════════════════════ */}
      {/* ZONE 3: BEACH (600–950)                        */}
      {/* ═══════════════════════════════════════════════ */}

      {/* Sandy ground */}
      <path
        d="M620,350 Q700,342 780,348 Q850,340 920,350 L960,348 L960,400 L620,400 Z"
        fill="url(#sandGrad)"
      />
      {/* Sand ripple details */}
      <path d="M660,370 Q700,365 740,370 Q780,365 820,370" fill="none" stroke="#c4a868" strokeWidth="0.8" opacity="0.4" />
      <path d="M680,382 Q720,378 760,382 Q800,377 840,382" fill="none" stroke="#c4a868" strokeWidth="0.6" opacity="0.3" />
      <path d="M700,392 Q740,389 780,392 Q820,388 860,392" fill="none" stroke="#c4a868" strokeWidth="0.5" opacity="0.25" />

      {/* Shells */}
      <ellipse cx="710" cy="365" rx="3" ry="2" fill="#e0caa0" stroke="#c4a868" strokeWidth="0.5" transform="rotate(20,710,365)" />
      <ellipse cx="810" cy="375" rx="2.5" ry="1.8" fill="#d8c098" stroke="#b89858" strokeWidth="0.5" transform="rotate(-15,810,375)" />
      <path d="M762,368 Q764,364 766,368" fill="none" stroke="#c4a868" strokeWidth="0.8" />

      {/* ── Palm Tree 1 ── */}
      <g>
        {/* Trunk — curved */}
        <path
          d="M700,355 Q695,310 702,270 Q708,230 695,195"
          fill="none"
          stroke="url(#trunkGrad)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Trunk segments */}
        <path d="M698,340 Q703,338 706,340" fill="none" stroke="#5a3d26" strokeWidth="0.8" opacity="0.5" />
        <path d="M697,320 Q702,318 706,320" fill="none" stroke="#5a3d26" strokeWidth="0.8" opacity="0.5" />
        <path d="M698,300 Q703,298 707,300" fill="none" stroke="#5a3d26" strokeWidth="0.8" opacity="0.5" />
        <path d="M700,280 Q704,278 708,280" fill="none" stroke="#5a3d26" strokeWidth="0.8" opacity="0.5" />

        {/* Coconuts */}
        <circle cx="696" cy="200" r="4" fill="#8a6a3a" />
        <circle cx="702" cy="198" r="3.5" fill="#7a5a2e" />

        {/* Fronds */}
        <g className="palm-frond">
          <path d="M695,195 Q660,170 630,180" fill="none" stroke="#2e8a45" strokeWidth="3" strokeLinecap="round" />
          <path d="M695,195 Q680,160 665,155" fill="none" stroke="#3aa055" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M695,195 Q710,155 730,150" fill="none" stroke="#2e8a45" strokeWidth="3" strokeLinecap="round" />
          <path d="M695,195 Q720,170 745,175" fill="none" stroke="#3aa055" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M695,195 Q690,155 680,140" fill="none" stroke="#40aa60" strokeWidth="2" strokeLinecap="round" />
          <path d="M695,195 Q705,160 715,148" fill="none" stroke="#40aa60" strokeWidth="2" strokeLinecap="round" />
          {/* Leaf details */}
          <path d="M660,178 L645,182 M660,178 L648,174" stroke="#2a7a3a" strokeWidth="1" opacity="0.6" />
          <path d="M670,158 L658,162 M670,158 L660,152" stroke="#2a7a3a" strokeWidth="1" opacity="0.6" />
          <path d="M722,155 L735,158 M722,155 L733,148" stroke="#2a7a3a" strokeWidth="1" opacity="0.6" />
          <path d="M735,173 L748,178 M735,173 L746,168" stroke="#2a7a3a" strokeWidth="1" opacity="0.6" />
        </g>
      </g>

      {/* ── Palm Tree 2 (shorter, right) ── */}
      <g>
        <path
          d="M860,360 Q865,320 858,285 Q852,255 862,225"
          fill="none"
          stroke="url(#trunkGrad)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="M859,342 Q863,340 866,342" fill="none" stroke="#5a3d26" strokeWidth="0.7" opacity="0.5" />
        <path d="M858,322 Q862,320 865,322" fill="none" stroke="#5a3d26" strokeWidth="0.7" opacity="0.5" />
        <path d="M857,302 Q861,300 864,302" fill="none" stroke="#5a3d26" strokeWidth="0.7" opacity="0.5" />

        <circle cx="860" cy="230" r="3.5" fill="#8a6a3a" />

        <g className="palm-frond" style={{ animationDelay: "1.5s" }}>
          <path d="M862,225 Q835,205 815,212" fill="none" stroke="#2e8a45" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M862,225 Q845,195 835,188" fill="none" stroke="#3aa055" strokeWidth="2" strokeLinecap="round" />
          <path d="M862,225 Q880,195 895,192" fill="none" stroke="#2e8a45" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M862,225 Q885,205 900,210" fill="none" stroke="#3aa055" strokeWidth="2" strokeLinecap="round" />
          <path d="M862,225 Q855,192 848,180" fill="none" stroke="#40aa60" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M862,225 Q870,195 878,185" fill="none" stroke="#40aa60" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </g>

      {/* ── Surfboards ── */}
      {/* Orange surfboard */}
      <g transform="translate(740, 325) rotate(-8)">
        <ellipse cx="0" cy="0" rx="5" ry="26" fill="#e8763a" />
        <ellipse cx="0" cy="0" rx="4" ry="24" fill="#f08a4a" />
        <line x1="0" y1="-22" x2="0" y2="22" stroke="#c4612e" strokeWidth="0.8" />
        <ellipse cx="0" cy="-12" rx="2" ry="4" fill="none" stroke="#c4612e" strokeWidth="0.6" />
        {/* Fin */}
        <polygon points="-2,20 0,26 2,20" fill="#c4612e" />
      </g>

      {/* Blue surfboard */}
      <g transform="translate(770, 328) rotate(5)">
        <ellipse cx="0" cy="0" rx="4.5" ry="24" fill="#6bb5d9" />
        <ellipse cx="0" cy="0" rx="3.5" ry="22" fill="#7ec5e5" />
        <line x1="0" y1="-20" x2="0" y2="20" stroke="#4a95b8" strokeWidth="0.8" />
        <ellipse cx="0" cy="-10" rx="1.8" ry="3.5" fill="none" stroke="#4a95b8" strokeWidth="0.6" />
        <polygon points="-1.8,18 0,24 1.8,18" fill="#4a95b8" />
      </g>

      {/* Yellow surfboard */}
      <g transform="translate(795, 330) rotate(-3)">
        <ellipse cx="0" cy="0" rx="5" ry="25" fill="#f5c542" />
        <ellipse cx="0" cy="0" rx="4" ry="23" fill="#f8d460" />
        <line x1="0" y1="-21" x2="0" y2="21" stroke="#d4a832" strokeWidth="0.8" />
        <ellipse cx="0" cy="-11" rx="2" ry="4" fill="none" stroke="#d4a832" strokeWidth="0.6" />
        <polygon points="-2,19 0,25 2,19" fill="#d4a832" />
      </g>

      {/* ═══════════════════════════════════════════════ */}
      {/* ZONE 4: OCEAN (900–1200)                       */}
      {/* ═══════════════════════════════════════════════ */}

      {/* Deep ocean base */}
      <path
        d="M900,348 Q940,340 980,345 Q1020,340 1060,348 Q1100,342 1140,350 L1200,345 L1200,400 L900,400 Z"
        fill="url(#oceanDeep)"
      />

      {/* Wave layer 1 — deepest, slowest */}
      <path
        className="ocean-wave"
        d="M880,365 Q920,355 960,362 Q1000,352 1040,360 Q1080,350 1120,358 Q1160,348 1200,355 L1200,400 L880,400 Z"
        fill="url(#oceanMid)"
        opacity="0.8"
      />

      {/* Wave layer 2 — mid depth */}
      <path
        className="ocean-wave"
        d="M890,375 Q930,365 970,372 Q1010,362 1050,370 Q1090,360 1130,368 Q1170,358 1200,365 L1200,400 L890,400 Z"
        fill="url(#oceanSurf)"
        opacity="0.7"
        style={{ animationDelay: "2s" }}
      />

      {/* Wave layer 3 — foreground, fastest */}
      <path
        className="ocean-wave"
        d="M900,385 Q940,378 980,384 Q1020,376 1060,382 Q1100,374 1140,380 Q1170,374 1200,378 L1200,400 L900,400 Z"
        fill="#3ecfbe"
        opacity="0.5"
        style={{ animationDelay: "4s" }}
      />

      {/* Sea foam on crests */}
      <g filter="url(#softGlow)">
        <path
          d="M930,358 Q940,354 950,358"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <path
          d="M1010,355 Q1022,350 1035,355"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M1100,352 Q1110,348 1122,352"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          opacity="0.55"
        />
        <path
          d="M960,372 Q972,367 985,372"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          opacity="0.4"
        />
        <path
          d="M1060,368 Q1070,364 1082,368"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          opacity="0.45"
        />
        <path
          d="M1150,356 Q1160,352 1172,356"
          fill="none"
          stroke="white"
          strokeWidth="1"
          opacity="0.4"
        />
      </g>

      {/* Horizon glow line */}
      <line
        x1="920"
        y1="345"
        x2="1200"
        y2="340"
        stroke="#f5c87a"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <line
        x1="920"
        y1="346"
        x2="1200"
        y2="341"
        stroke="#f5a060"
        strokeWidth="0.8"
        opacity="0.2"
      />

      {/* ═══════════════════════════════════════════════ */}
      {/* CONTINUOUS GROUND CONTOUR (blends all zones)   */}
      {/* ═══════════════════════════════════════════════ */}
      <path
        d="M0,400 L0,355 Q70,340 140,350 Q210,338 280,348 Q350,340 420,350 Q490,342 560,348 Q630,342 700,350 Q770,344 840,352 Q900,346 960,350 Q1020,344 1080,350 Q1140,346 1200,348 L1200,400 Z"
        fill="none"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth="1"
      />

      {/* Distant birds near the horizon */}
      <g opacity="0.3">
        <path d="M1020,285 Q1025,280 1030,285" fill="none" stroke="#4a5a6a" strokeWidth="1" />
        <path d="M1045,278 Q1050,273 1055,278" fill="none" stroke="#4a5a6a" strokeWidth="0.8" />
        <path d="M1070,282 Q1074,278 1078,282" fill="none" stroke="#4a5a6a" strokeWidth="0.7" />
      </g>
    </svg>
  );
}
