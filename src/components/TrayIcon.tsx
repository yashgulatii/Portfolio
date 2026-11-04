type TrayIconProps = {
  index: number;
};

const TrayIcon = ({ index }: TrayIconProps) => {
  return (
    <svg
      className="tray-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2B2B2B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {index === 0 && (
        <>
          <circle cx="9" cy="9" r="6.5" />
          <path d="M6 7h6M5.5 9.5h7M6 12h6M13.8 13.8 21 21" />
        </>
      )}
      {index === 1 && (
        <>
          <path d="M12 7v5M6 12h12M6 12v4M18 12v4" />
          <circle cx="12" cy="5" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </>
      )}
      {index === 2 && (
        <path d="M20 4a6 6 0 0 1-7.8 7.8l-7 7a2 2 0 0 1-2.8-2.8l7-7A6 6 0 0 1 17.2 1L14 4.2 17.8 8 21 4.8Z" />
      )}
      {index === 3 && (
        <>
          <rect x="3" y="4" width="18" height="16" rx="1.5" />
          <path d="M3 8h18M7 12l3 2-3 2m7 0h4" />
        </>
      )}
      {index === 4 && (
        <>
          <rect x="7" y="7" width="10" height="10" />
          <path d="M9 2v5m4-5v5m4-5v5M9 17v5m4-5v5m4-5v5M2 9h5m-5 4h5m-5 4h5m10-8h5m-5 4h5m-5 4h5" />
        </>
      )}
    </svg>
  );
};

export default TrayIcon;