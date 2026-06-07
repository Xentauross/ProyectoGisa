export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="100" cy="100" r="97" fill="#2aafa0" />
            <circle cx="100" cy="100" r="90" fill="#ffffff" />
            <circle cx="100" cy="100" r="85" fill="none" stroke="#2aafa0" strokeWidth="1.5" opacity="0.4" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#2aafa0" strokeWidth="0.5" opacity="0.15" />
            <text x="100" y="100" textAnchor="middle" fontFamily="Georgia,'Times New Roman',serif" fontStyle="italic" fontWeight="bold" fontSize="38" fill="#1a7a6e" letterSpacing="1">G.I.S.A.</text>
            <rect x="79" y="136" width="42" height="7" rx="1" fill="#2aafa0" />
            <ellipse cx="100" cy="130" rx="18" ry="11" fill="#2aafa0" />
            <ellipse cx="86" cy="132" rx="10" ry="8" fill="#2aafa0" />
            <ellipse cx="114" cy="132" rx="10" ry="8" fill="#2aafa0" />
            <ellipse cx="100" cy="126" rx="12" ry="9" fill="#2aafa0" />
            <path d="M78 176 Q100 182 122 176 L118 170 L82 170 Z" fill="#2aafa0" />
            <line x1="100" y1="170" x2="100" y2="148" stroke="#2aafa0" strokeWidth="1.5" />
            <path d="M100 149 L100 169 L84 165 Z" fill="#2aafa0" />
            <path d="M100 153 L100 169 L115 166 Z" fill="#3dc4b4" opacity="0.75" />
            <path d="M75 183 Q82 180 89 183 Q96 186 103 183 Q110 180 117 183 Q124 186 125 183" fill="none" stroke="#2aafa0" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M78 188 Q86 185 94 188 Q102 191 110 188 Q118 185 122 188" fill="none" stroke="#2aafa0" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
    );
}
